/* converts media input via non-blocking ffmpeg child-processes
uses ffmpeg binaries tied to node project, should work when ffmpgeg is not 
installed locally
*/

import { spawn } from "child_process";

export function convertVideoToAudio(inputPath: string, outputPath: string) {
 
  return new Promise((resolve, reject) => {
    const childProcess = spawn("ffmpeg", [
      "-i",
      inputPath, // path to input file
      "-codec:a",
      "libmp3lame", // mp3Codec
      "-b:a",
      "96k", // limit output bitrate of audio
      "-vn", // no video
      outputPath,
      "-y",
      "-loglevel",
      "error", // log only when error occurs
    ]);
    childProcess.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });
    childProcess.stderr.on("data", (data) => {
      console.log(`stderr: ${data}`);
    });
    childProcess.on("error", (error: unknown) => {
      console.log(error);
      reject("Failed to convert file: " + error);
      return;
    });
    // if conversion was successful ->resolve
    childProcess.on("exit", (code) => {
      if (code === 0) {
        resolve("success");
      } else {
        reject(new Error(`Failed converting the video file`));
      }
    });
  });
}

export function splitAudio(
  inputPath: string,
  outputPath: string,
  chunkDuration: number,
) {
  return new Promise((resolve, reject) => {
    
    const childProcess = spawn("ffmpeg", [
      "-i",
      inputPath, // path to input file
      "-codec:a",
      "copy", // no re-encoding
      "-vn", // no video
      "-f",
      "segment", // format is segment
      "-segment_time",
      chunkDuration.toString(), // length of segments in seconds
      "-map",
      "0", // maps all the streams from input to the output
      outputPath,
      "-y",
      "-loglevel",
      "error",
    ]);
    childProcess.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });
    childProcess.stderr.on("data", (data) => {
      console.log(`stderr: ${data}`);
    });
    childProcess.on("error", (error) => {
      console.log(error);
      reject("Failed to split file");
    });
    childProcess.on("exit", (code) => {
      if (code === 0) {
        resolve("success");
      } else {
        reject(new Error(`Failed to split file`));
      }
    });
  });
}

export function getAudioDurationInSeconds(inputPath: string) {
  console.log("Getting size of audio file");
  
  return new Promise((resolve, reject) => {
    const childProcess = spawn("ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      inputPath,
    ]);
    childProcess.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
      const duration = parseFloat(data);
      resolve(duration);
    });
    childProcess.stderr.on("data", (data) => {
      console.log(`stderr: ${data}`);
      reject("Failed to get audio duration");
      return;
    });
    childProcess.on("error", (error) => {
      console.log(error);
      reject("Failed to get audio duration");
      return;
    });
    childProcess.on("exit", async (code, signal) => {
      if (signal) {
        console.log(`Process killed with signal: ${signal}`);
        reject("Failed to get audio duration");
        return;
      }
    });
  });
}
