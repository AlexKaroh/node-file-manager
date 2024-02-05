import { TABLE_FOOTER, TABLE_HEADER_SKELET } from "../constants/constants.js";
import { stdout, stdin } from "process";
import fs from "fs";
import path from "path";

export class NavigationCommandsHandler {
  constructor(fileManager, data) {
    this.fileManager = fileManager;
    this.data = data;
  }

  handleCommand() {
    if (this.data.length >= 2 && this.data[0] !== "cd") {
      console.log(`Invalid input! Unknown ${this.data[1]} argument`);
      console.log(this.fileManager.currentUrlMessage);
      stdin.resume();
      return;
    }

    switch (this.data[0]) {
      case ".exit": {
        this.exitProccess();
      }

      case "up": {
        this.upDir();
        stdin.resume();
        break;
      }

      case "cd": {
        this.changeDirectory(this.data[1]);
        stdin.resume();
        break;
      }

      case "ls": {
        this.showListDirectory();
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

  showListDirectory() {
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
    const newDir = path.resolve(this.fileManager.currentPath, targetDir);

    if (fs.existsSync(newDir) && fs.statSync(newDir).isDirectory()) {
      this.fileManager.currentPath = newDir;
    } else {
      console.log(`Invalid input! Directory '${targetDir}' not found.`);
    }

    console.log(this.fileManager.currentUrlMessage);
  }

  upDir() {
    const parentDir = path.resolve(this.fileManager.currentPath, "..");

    parentDir !== this.fileManager.currentPath
      ? (this.fileManager.currentPath = parentDir)
      : console.log("Operation failed! Already in root folder");

    console.log(this.fileManager.currentUrlMessage);
  }

  exitProccess() {
    stdout.write(this.fileManager.exitMessage);
    process.exit();
  }
}
