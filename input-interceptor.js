import { stdout, stdin } from "process";

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
    stdin.on("data", (data) => this.dataHandler(data.toString("utf8").trim()));
  }

  dataHandler(data) {
    switch (data) {
      case ".exit": {
        this.exitProccess();
      }
      case "up": {
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

  exitProccess() {
    stdout.write(this.fileManager.exitMessage);
    process.exit();
  }

  initInterceptor() {
    console.log(this.fileManager.welcomeMessage);
    console.log(this.fileManager.currentDir);

    this.setExitListener();
    this.setInputListener();
  }
}
