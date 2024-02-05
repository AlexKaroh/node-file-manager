import { TABLE_FOOTER, TABLE_HEADER_SKELET } from "./constants.js";
import { stdout, stdin } from "process";
import { resolve } from "path";
import fs from "fs";
import path from "path";

export class InputInterceptor {
  constructor(fileManager) {
    this.fileManager = fileManager;
  }

  setExitListener() {
    process.on("SIGINT", () => {
      this.exitProccess();
    });
  }

  setInputListener() {
    stdin.on("data", (data) => {
      const dataToString = data.toString("utf8").trim().split(" ");
      this.dataHandler(dataToString);
    });
  }

  /**
   * @param {Array<string>} data Array of input args from terminal.
   */
  dataHandler(data) {
    switch (data[0]) {
      case ".exit": {
        this.exitProccess();
      }

      case "up": {
        this.upDir();
        stdin.resume();
        break;
      }

      case "cd": {
        this.changeDirectory(data[1]);
        stdin.resume();
        break;
      }

      case "ls": {
        this.showlistDirectory();
        stdin.resume();
        break;
      }

      case "cat": {
        this.readFileContent(data[1]);
        stdin.resume();
        break;
      }

      case "add": {
        this.addFile(data[1]);
        stdin.resume();
        break;
      }

      case "rn": {
        this.renameFile(data[1], data[2]);
        stdin.resume();
        break;
      }

      case "cp": {
        this.copyFile(data[1], data[2]);
        stdin.resume();
        break;
      }

      case "mv": {
        this.moveFile(data[1], data[2]);
        stdin.resume();
        break;
      }

      case "rm": {
        this.deleteFile(data[1], true);
        stdin.resume();
        break;
      }

      default: {
        console.log("Operation failed");
        stdin.resume();
        break;
      }
    }
  }

  deleteFile(filePath, isTracked = false) {
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

  showlistDirectory() {
    const currentDir = this.fileManager.currentPath;

    try {
      const files = fs.readdirSync(currentDir);

      const tableData = files.map((file, index) => {
        const filePath = path.join(currentDir, file);
        const isDirectory = fs.statSync(filePath).isDirectory();
        const fileType = isDirectory ? "folder" : " file ";
        return [index, file, fileType];
      });

      TABLE_HEADER_SKELET.map((el) => console.log(el));

      tableData.forEach(([index, file, fileType]) => {
        console.log(
          `│    ${index}    │ '${file}'${" ".repeat(
            46 - file.length
          )} │ '${fileType}' │`
        );
      });
      console.log(TABLE_FOOTER);
    } catch (error) {
      console.error(`Operation failed! ${error}`);
    }
    console.log(this.fileManager.currentUrlMessage);
  }

  changeDirectory(targetDir) {
    const newDir = resolve(this.fileManager.currentPath, targetDir);

    if (fs.existsSync(newDir) && fs.statSync(newDir).isDirectory()) {
      this.fileManager.currentPath = newDir;
    } else {
      console.log(`Operation failed! Directory '${targetDir}' not found.`);
    }

    console.log(this.fileManager.currentUrlMessage);
  }

  upDir() {
    const parentDir = resolve(this.fileManager.currentPath, "..");

    parentDir !== this.fileManager.currentPath
      ? (this.fileManager.currentPath = parentDir)
      : console.log("Operation failed! Already in root folder");

    console.log(this.fileManager.currentUrlMessage);
  }

  exitProccess() {
    stdout.write(this.fileManager.exitMessage);
    process.exit();
  }

  initInterceptor() {
    console.log(this.fileManager.welcomeMessage);
    console.log(this.fileManager.currentUrlMessage);

    this.setExitListener();
    this.setInputListener();
  }
}
