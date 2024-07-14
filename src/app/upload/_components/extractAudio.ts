// import FFmpeg

"use client";
import getErrorMessage from "@/utils/getErrorMessage";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL, fetchFile } from "@ffmpeg/util";
const ffmpeg = new FFmpeg();
const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

export const extractAudio = async (file: File) => {
  console.log("converting video to mp3");

  // get file extension
  const extension = file.name.split(".").pop();
  try {
    // load ffmpeg
    await loadFfmpeg();

    ffmpeg.on("log", ({ message }) => {
      console.log(message);
    });
    // transform file from video to audio if file is video
    // write temp file
    await ffmpeg.writeFile(`input.${extension}`, await fetchFile(file));

    // transform witth ffmpeg
    await ffmpeg.exec([
      "-i",
      `input.${extension}`, // path to input file
      "-codec:a",
      "libmp3lame", // mp3Codec
      "-b:a",
      "96k", // limit output bitrate of audio
      "-vn", // no video
      "output.mp3", // output name
      "-y",
      "-loglevel",
      "error", // log only when error occurs
    ]);

    // read newly created output file and create new file object
    const data = await ffmpeg.readFile("output.mp3");

    const newFile = new File([data.valueOf()], "converted.mp3", {
      type: "audio/mpeg",
    });
    console.log("conversion done");
    // console.log(newFile);

    // clean-up: delete input and output files, terminate ffmpeg
    await ffmpeg.deleteFile("output.mp3");
    await ffmpeg.deleteFile(`input.${extension}`);
    ffmpeg.terminate();

    // return new file object
    return newFile;
  } catch (error) {
    await ffmpeg.deleteFile(`input.${extension}`);
    ffmpeg.terminate();
    throw getErrorMessage(error);
  }
};

const loadFfmpeg = async () => {
  try {
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm",
      ),
      workerURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.worker.js`,
        "text/javascript",
      ),
    });
  } catch (err) {
    throw err;
  }

  console.log("ffmpeg loaded");
};
