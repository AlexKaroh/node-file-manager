import { stdout, stdin } from "process";
import { resolve } from "path";

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
      this.dataHandler(data.toString("utf8").trim());
    });
  }

  dataHandler(data) {
    switch (data) {
      case ".exit": {
        this.exitProccess();
      }
      case "up": {
        this.upDir();
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
