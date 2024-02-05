import { stdin } from "process";
import { createReadStream, createWriteStream } from "fs";
import { createBrotliCompress, createBrotliDecompress } from "zlib";
import * as fs from "fs";

export class CompressCommandsHandler {
  constructor(fileManager, data) {
    this.fileManager = fileManager;
    this.data = data;
  }

  handleCommand() {
    if (this.data.length > 3) {
      console.log(`Invalid input! Unknown ${this.data[3]} argument`);
      console.log(this.fileManager.currentUrlMessage);
      stdin.resume();
      return;
    }

    switch (this.data[0]) {
      case "compress": {
        this.compressFile(this.data[1], this.data[2]);
        stdin.resume();
        return;
      }

      case "decompress": {
        this.decompressFile(this.data[1], this.data[2]);
        stdin.resume();
        return;
      }
    }
  }

  compressFile(sourceFilePath, destinationFilePath) {
    if (!sourceFilePath || !destinationFilePath) {
      console.log(`Invalid input! Some of args is empty`);
      console.log(this.fileManager.currentUrlMessage);
      stdin.resume();
      return;
    }

    if (!fs.existsSync(sourceFilePath)) {
      console.error(`Invalid input! ${sourceFilePath} does not exist`);
      console.log(this.fileManager.currentUrlMessage);
      stdin.resume();
      return;
    }

    const outputStream = createWriteStream(destinationFilePath);
    const compressStream = createBrotliCompress();

    createReadStream(sourceFilePath).pipe(compressStream).pipe(outputStream);

    outputStream.on("finish", () => {
      console.log(
        `File '${sourceFilePath}' compressed and saved to '${destinationFilePath}'`
      );
      console.log(this.fileManager.currentUrlMessage);
    });

    outputStream.on("error", (error) => {
      console.error(`Error writing compressed file: ${error}`);
      console.log(this.fileManager.currentUrlMessage);
    });

    compressStream.on("error", (error) => {
      console.error(`Error compressing file: ${error}`);
      console.log(this.fileManager.currentUrlMessage);
    });
  }

  decompressFile(sourceFilePath, destinationFilePath) {
    if (!sourceFilePath || !destinationFilePath) {
      console.log(`Invalid input! Some of args is empty`);
      console.log(this.fileManager.currentUrlMessage);
      stdin.resume();
      return;
    }

    if (!fs.existsSync(sourceFilePath)) {
      console.error(`Invalid input! ${sourceFilePath} does not exist`);
      console.log(this.fileManager.currentUrlMessage);
      stdin.resume();
      return;
    }

    const inputStream = createReadStream(sourceFilePath);
    const outputStream = createWriteStream(destinationFilePath);
    const decompressStream = createBrotliDecompress();

    inputStream.pipe(decompressStream).pipe(outputStream);

    outputStream.on("finish", () => {
      console.log(
        `File '${sourceFilePath}' decompressed and saved to '${destinationFilePath}'`
      );
      console.log(this.fileManager.currentUrlMessage);
    });

    outputStream.on("error", () => {
      console.error(`Operation failed!`);
      console.log(this.fileManager.currentUrlMessage);
    });

    decompressStream.on("error", () => {
      console.error(`Operation failed! Error decompressing file`);
      console.log(this.fileManager.currentUrlMessage);
    });
  }
}
