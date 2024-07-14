/* Submit Audio to OpenAI API, get transcript and save it in supabase

Steps:
0) prechecks: return early if no file submitted or too big
1) User authentication with supabase
2) Write file stream to disc 
3) Check if user has free credits or an own API Key set
4) if file is smaller than 25 MB (Size limit by OpenAi) -> make API Call to OpenAI and skip steps 5) and 6) 
5) Split input file into chunks < 25 MB
6) API Call to OpenAi with every chunk
7) Create a project in supabase and write transcript to it
8) Upload input file to supabase storage

Clean-up-function to delete files an server is called at end 
*/

"use server";
import { createSupaseServerClient } from "@/lib/supabase/server";
import getErrorMessage from "@/utils/getErrorMessage";
import { join } from "path";
import { writeFile, mkdir, stat, readdir, rm } from "fs/promises";
import fetchTranscript from "./fetchTranscript";
import { ProjectSchema, TranscriptSchema } from "@/lib/types";
import { getAudioDurationInSeconds, splitAudio } from "./ffmpgOperations";
import {
  createProject,
  getCredits,
  getOpenAiKey,
  uploadFile,
} from "@/lib/supabase/actions";
import { revalidatePath } from "next/cache";
import mime from "mime";

// size config
const maxInputSize: number =
  Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE) || 1e9; // 1000 MB ( 1e9) - max file size upload
const maxChunkSize: number =
  Number(process.env.NEXT_PUBLIC_MAX_CHUNK_SIZE) || 24e6; // 24e+6 (24 MB)

export async function uploadServerAction(formData: FormData) {
  // // video formats that will be converted
  // const videoFormats = [
  //   "video/mp4",
  //   "video/quicktime",
  //   "video/webm",
  //   "video/x-sgi-movie",
  //   "video/ogg",
  //   "video/mpeg",
  //   "video/x-msvideo",
  //   "video/x-ms-wmv",
  //   "video/x-flv",
  //   "video/x-matroska",
  //   "audio/x-matroska",
  //   "video/3gpp",
  //   "audio/wav",
  // ];

  // create supabase client
  const supabase = createSupaseServerClient();

  // initialize project folder
  let projectFolder: string | undefined = "";

  try {
    // 0) -- prechecks: return early if no file submitted or too big
    console.log("0) -- Running prechecks");

    // read formdata
    const file: File | null = formData.get("file") as unknown as File;
    let projectName: string | null = formData.get(
      "projectname",
    ) as unknown as string;
    let description: string | null = formData.get(
      "description",
    ) as unknown as string;

    // check if a file was submitted
    if (!file) {
      throw "no file submitted";
    }

    // check if projectname was submitted
    if (!projectName) {
      throw "projectname missing";
    }

    // server side validation of projectName with zod
    const resultProjectName =
      ProjectSchema.shape.projectname.safeParse(projectName);
    if (!resultProjectName.success) {
      const errorMessage = resultProjectName.error.issues[0].message;
      throw "Projectname: " + errorMessage;
    }
    projectName = resultProjectName.data;

    // server side validation of description with zod
    const resultDescription =
      ProjectSchema.shape.description.safeParse(description);
    if (!resultDescription.success) {
      const errorMessage = resultDescription.error.issues[0].message;
      throw "Decription: " + errorMessage;
    }
    description = resultDescription.data;

    // check file size
    let inputFileSize = file.size;
    if (inputFileSize > maxInputSize) {
      throw "File is too big";
    }

    // (1) --check if user is logged in
    console.log("1) -- Checking user");
    const { data: user, error: errorUser } = await supabase.auth.getUser();
    const userId = user.user?.id;
    if (errorUser || !userId) {
      throw "User could not be validated, please try again";
    }

    // (2) -- write file to disc
    console.log("2) -- writing file to disc");
    let { pathToFile, updatedProjectFolder } = await writeToDisc(
      file,
      projectFolder,
    );
    projectFolder = updatedProjectFolder;
    // check mime type:
    const mimeType = mime.getType(pathToFile);
    console.log(mimeType);

    // (3) -- check if user has enough free credits or an OpenAI-key set

    // get length of audio / vioe input file
    let duration = 0;
    try {
      duration = (await getAudioDurationInSeconds(pathToFile)) as number;
      // console.log("duration", duration);
    } catch (error) {
      console.log(error);
      throw "Failed to get audio duration";
    }

    // check credits
    const { data: creditsData, error: creditsError } = await checkCredits(
      userId,
      pathToFile,
      duration,
    );
    if (creditsError) throw creditsError;
    if (!creditsData) throw "Failed to get free credits and OpenAiKey";

    // set open AI key
    let openAiKey: string;
    // use app-wide API-Key if user has free credits, otherwise  use users own API-Key
    if (creditsData.freeProject) {
      if (!process.env.NEXT_OPENAI_KEY)
        throw "Failed to get systemwide OpenAI API Key";
      openAiKey = process.env.NEXT_OPENAI_KEY;
    } else {
      if (!creditsData.openAiKey) throw "Failed to get your OpenAI API Key";
      openAiKey = creditsData.openAiKey;
    }

    // create transcript object (used later to save data in supabase)
    let transcript = {} as TranscriptSchema;

    // (4) -- make API Call to OpenAI if file smaller than 25 MB
    if (inputFileSize < maxChunkSize) {
      // make API call
      console.log("4) -- fetching transcript for single File");
      transcript = await getSingleTranscript(pathToFile, openAiKey);
    } else {
      // (5) -- split file into smaller chunks
      console.log("5) -- spliting file into smaller chunks");
      const chunks = await createChunks(
        pathToFile,
        inputFileSize,
        projectFolder,
        duration,
      );
      console.log(chunks);

      // (6) -- API Call to OpenAi with every chunk
      console.log("6) -- fetching transcript for chunks");
      const { data: ChunkTranscripts, error } = await getChunkTranscripts(
        chunks,
        openAiKey,
      );
      if (error) throw error;
      if (!ChunkTranscripts) throw "Could not fetch transcript for chunks";
      transcript = ChunkTranscripts;
    }

    // (7) -- Create a project in supabase and write transcript to it
    console.log("7) -- writing to DB");
    // create file name out of Date ( we should not trust original file name)
    const nameOfFileInSupabase =
      Date.now().toString() + "." + pathToFile.split(".").pop();

    // create project
    const params = {
      user_id: userId,
      projectname: projectName,
      filename: nameOfFileInSupabase,
      transcript: JSON.stringify(transcript),
      description: description,
      is_free: creditsData.freeProject ? true : false,
      duration: duration,
    };

    const { data: projectId, error: createProjectError } =
      await createProject(params);
    if (!projectId || createProjectError) throw createProjectError;

    // (8) -- Upload input file to supabase storage
    console.log("8) -- uploading file");
    await uploadFile({
      pathToFile: pathToFile,
      nameOfFileInSupabase: nameOfFileInSupabase,
      userId: userId,
      projectId: projectId,
    });
    // update dashboard route
    revalidatePath("/projects");
    return { data: projectId };
  } catch (error) {
    return { error: "Something went wrong: " + getErrorMessage(error) };
  } finally {
    //clean up
    if (projectFolder) {
      removeProjectFolder(projectFolder);
    }
  }
}

// *** helper function for steps ***
// (2) -- write file to disc with unique name
const writeToDisc = async (file: File, projectFolder: string | undefined) => {
  try {
    // create a random named folder for the project
    const uniqueID = (Date.now() + Math.round(Math.random() * 1e4)).toString();
    if (!uniqueID) throw "Failed to create unique name for project folder";
    const pathToProjectFolder = join(__dirname, "..", "tmpFiles", uniqueID);
    projectFolder = await mkdir(pathToProjectFolder, {
      recursive: true,
    });
    if (!projectFolder) throw "failed to create project Folder";
  } catch (error) {
    console.log(error);
    throw "Failed to write project Folder";
  }

  console.log("Created Folder: ", projectFolder);

  // path to file
  const fileExtension = "." + file.name.split(".").pop();
  const inputFileName = "input" + fileExtension;
  const pathToFile = join(projectFolder, inputFileName);

  // save to disc
  try {
    // turn file into buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    // write to disc
    await writeFile(pathToFile, buffer);
  } catch (error) {
    throw "Failed to save file on server ";
  }
  // return path to file and path to projectFolder
  return { pathToFile: pathToFile, updatedProjectFolder: projectFolder };
};

//(3) -- check if user has free credits or an API key set
const checkCredits = async (
  userId: string,
  pathToFile: string,
  duration: number,
) => {
  try {
    // get credits
    const { data: credits, error: errorCredits } = await getCredits(userId);

    if (errorCredits || credits === undefined || credits === null)
      throw "Failed to get the amount of free credits";

    // get openAiKey
    const { data: openAiKey, error: errorKey } = await getOpenAiKey(userId);

    // project if free if user has enough free credits
    if (credits - duration > 0) return { data: { freeProject: true } };

    if (errorKey) throw "Failed to get your OpenAI API-key";
    if (openAiKey) return { data: { openAiKey: openAiKey } };
  } catch (error) {
    return { error: error };
  }
  return {};
};

// (4) -- Fetch transcript for single file
const getSingleTranscript = async (pathToFile: string, openAiKey: string) => {
  let transcript: TranscriptSchema = {
    duration: 0,
    text: "",
    segments: [],
  };
  try {
    const { data: apiResult, error: openAiError } = await fetchTranscript(
      pathToFile,
      openAiKey,
    );
    if (openAiError) throw openAiError;
    if (!apiResult) throw "Failed to fetch transcript";

    // write only wanted data to transcript object
    for (const segmentApiResult of apiResult["segments"]) {
      let segment = {
        start: segmentApiResult["start"],
        end: segmentApiResult["end"],
        text: segmentApiResult["text"],
      };
      transcript["segments"].push(segment);
    }
    transcript["text"] = apiResult["text"];
    transcript["duration"] = apiResult["duration"];
  } catch (error) {
    console.log(error);
    throw error;
  }
  return transcript;
};

// (5) -- Use ffmpeg to split file into smaller chunks
const createChunks = async (
  inputPath: string,
  inputFileSize: number,
  pathToProjectFolder: string,
  duration: number,
) => {
  // calculate length of chunks in seconds
  /* Calculation steps
    Filesize /  duration = sizeProSecond
    sizeProSecond x  chunkduration = maxChunkSize / 1.25   //1.25 is safety buffer
    chunkduration = (maxChunkSize / 1.25) / sizeProSecond
  */
  const chunkDuration = maxChunkSize / 1.25 / (inputFileSize / duration);

  //create subfolder for chunks
  const pathToChunksFolder = join(pathToProjectFolder, "chunks");
  let chunksFolder = undefined;
  try {
    chunksFolder = await mkdir(pathToChunksFolder, {
      recursive: true,
    });
    if (!chunksFolder) throw "Failed to create a folder for chunks";
  } catch (error) {
    console.log(error);
    throw "Failed to create a folder for chunks";
  }

  // split audio with ffmpeg
  try {
    // specify output path
    const outputPath = join(
      chunksFolder,
      `input-%03d.${inputPath.split(".").pop()}`,
    ); // %03d is placeholder for chunks number, will be replaced by ffmpeg

    // use ffmpeg to create chunks
    await splitAudio(inputPath, outputPath, chunkDuration);
    console.log("> chunks written to disk");
  } catch (error) {
    console.log(error);
    throw "Failed to split file";
  }

  // find all newly written files and write full path to chunks array
  let chunks = [];
  try {
    const chunkFiles = await readdir(chunksFolder);
    for (let i in chunkFiles) {
      const pathToChunkfile = join(chunksFolder, chunkFiles[i]);
      // check if all chunks are indeed under 25 MB
      const chunkSize = (await stat(pathToChunkfile)).size;
      if (chunkSize > maxChunkSize) {
        console.log("chunk to big");
        throw "Failed to split file";
      }
      // write to chunks array
      chunks.push(pathToChunkfile);
    }
  } catch (error) {
    console.log(error);
    throw "Failed to find chunks";
  }
  return chunks;
};

// (6) -- fetch transcript of chunks
const getChunkTranscripts = async (chunks: string[], openAiKey: string) => {
  console.log("chunk fetching runs");
  let transcript: TranscriptSchema = {
    duration: 0,
    text: "",
    segments: [],
  };
  transcript["duration"] = 0;
  console.log(transcript);

  try {
    for (const chunk of chunks) {
      console.log(chunk);
      const { data: apiResult, error } = await fetchTranscript(
        chunk,
        openAiKey,
      );
      if (error) throw error;
      if (!apiResult) throw "Failed to fetch transcript";
      for (const apiResultSegment of apiResult["segments"]) {
        console.log(chunk, apiResultSegment);
        // add segments to transcript object with  right time stamps
        const segment = {
          start: transcript["duration"] + apiResultSegment["start"],
          end: transcript["duration"] + apiResultSegment["end"],
          text: apiResultSegment["text"],
        };
        transcript["segments"].push(segment);
      }
      // add pure text and duration to transcript object
      transcript["text"] += apiResult["text"] += " ";
      transcript["duration"] += apiResult["duration"];
    }
  } catch (error) {
    console.log(error);
    return { error: error };
  }
  return { data: transcript };
};

// clean up function
async function removeProjectFolder(projectFolder: string) {
  if (projectFolder) {
    try {
      await rm(projectFolder, { recursive: true });
      console.log(`${projectFolder} is deleted!`);
    } catch (error) {
      console.log("Could not remove project Folder");
    }
  }
}
