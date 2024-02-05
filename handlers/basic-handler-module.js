import { stdin } from "process";
import fs from "fs";
import path from "path";

export class BasicCommandsHandler {
  constructor(fileManager, data) {
    this.fileManager = fileManager;
    this.data = data;
  }

  handleCommand() {
    switch (this.data[0]) {
      case "cat": {
        this.readFileContent(this.data[1]);
        stdin.resume();
        break;
      }

      case "add": {
        this.addFile(this.data[1]);
        stdin.resume();
        break;
      }

      case "rn": {
        this.renameFile(this.data[1], this.data[2]);
        stdin.resume();
        break;
      }

      case "cp": {
        this.copyFile(this.data[1], this.data[2]);
        stdin.resume();
        break;
      }

      case "mv": {
        this.moveFile(this.data[1], this.data[2]);
        stdin.resume();
        break;
      }

      case "rm": {
        this.deleteFile(this.data[1], true);
        stdin.resume();
        break;
      }

      default: {
        console.log("Operation failed");
        console.log(this.fileManager.currentUrlMessage);
        stdin.resume();
        break;
      }
    }
  }

  deleteFile(filePath, isTracked = false) {
    if (!filePath) {
      console.error(`Operation failed! File path can't be empty`);
      console.log(this.fileManager.currentUrlMessage);
      return;
    }
    fs.unlink(filePath, (error) => {
      if (error) {
        console.error(`Operation failed! Error deleting file: ${error}`);
        console.log(this.fileManager.currentUrlMessage);
      } else if (!error && isTracked) {
        console.log(`File '${filePath}' deleted successfully.`);
        console.log(this.fileManager.currentUrlMessage);
      }
    });
  }

  moveFile(sourceFilePath, targetDirectory) {
    if (!sourceFilePath || !targetDirectory) {
      console.log("Operation failed! Some of args is empty");
      console.log(this.fileManager.currentUrlMessage);
      return;
    }
    const fileName = path.basename(sourceFilePath);
    const targetFilePath = path.join(targetDirectory, fileName);

    const readStream = fs.createReadStream(sourceFilePath, {
      encoding: "utf8",
    });
    const writeStream = fs.createWriteStream(targetFilePath);

    readStream.on("error", (error) => {
      console.error(`Operation failed! Error reading file: ${error}`);
      console.log(this.fileManager.currentUrlMessage);
    });

    writeStream.on("error", (error) => {
      console.error(`Operation failed! Error writing file: ${error}`);
      console.log(this.fileManager.currentUrlMessage);
    });

    writeStream.on("finish", () => {
      console.log(
        `File '${fileName}' moved to '${targetDirectory}' successfully.`
      );
      console.log(this.fileManager.currentUrlMessage);
      this.deleteFile(sourceFilePath);
    });

    readStream.pipe(writeStream);
  }

  copyFile(sourceFilePath, targetDirectory) {
    if (!sourceFilePath || !targetDirectory) {
      console.log("Operation failed! Some of args is empty");
      console.log(this.fileManager.currentUrlMessage);
      return;
    }
    const fileName = path.basename(sourceFilePath);
    const targetFilePath = path.join(targetDirectory, fileName);

    const readStream = fs.createReadStream(sourceFilePath, {
      encoding: "utf8",
    });
    const writeStream = fs.createWriteStream(targetFilePath);

    readStream.on("error", (error) => {
      console.error(`Operation failed! Error reading file: ${error}`);
      console.log(this.fileManager.currentUrlMessage);
    });

    writeStream.on("error", (error) => {
      console.error(`Operation failed! Error writing file: ${error}`);
      console.log(this.fileManager.currentUrlMessage);
    });

    writeStream.on("finish", () => {
      console.log(
        `File '${fileName}' copied to '${targetDirectory}' successfully.`
      );

      console.log(this.fileManager.currentUrlMessage);
    });

    readStream.pipe(writeStream);
  }

  renameFile(oldFilePath, newFileName) {
    if (!oldFilePath || !newFileName) {
      console.log("Operation failed! Some of args is empty");
      console.log(this.fileManager.currentUrlMessage);
      return;
    }
    const newFilePath = path.join(this.fileManager.currentPath, newFileName);

    fs.rename(oldFilePath, newFilePath, (error) => {
      if (error) {
        console.error(`Operation failed! Error renaming file: ${error}`);
      } else {
        console.log(
          `File '${oldFilePath}' renamed to '${newFileName}' successfully.`
        );
      }
    });
  }

  addFile(fileName) {
    if (fileName) {
      const filePath = path.join(this.fileManager.currentPath, fileName);

      fs.writeFile(filePath, "", (error) => {
        if (error) {
          console.error(`Operation failed! ${error}`);
          console.log(this.fileManager.currentUrlMessage);
        } else {
          console.log(`File: '${fileName}' created successfully.`);
          console.log(this.fileManager.currentUrlMessage);
        }
      });
    } else {
      console.error("Operation failed! File name can`t be empty");
      console.log(this.fileManager.currentUrlMessage);
    }
  }

  readFileContent(targetDir) {
    if (!targetDir) {
      console.log("Operation failed! File path can`t be empty");
      console.log(this.fileManager.currentUrlMessage);
      return;
    }
    const fileStream = fs.createReadStream(targetDir, { encoding: "utf8" });

    fileStream.on("data", (chunk) => {
      console.log(chunk);
    });

    fileStream.on("error", (error) => {
      console.error(`Operation failed! Error reading file: ${error}`);
    });

    fileStream.on("end", () => {
      console.log("End of file content");
      console.log(this.fileManager.currentUrlMessage);
    });
  }
}
