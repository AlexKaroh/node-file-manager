import { NAVIGATION_COMMANDS, BASIC_COMMANDS } from "../constants/constants.js";
import { NavigationCommandsHandler } from "../handlers/navigation-handler-module.js";
import { BasicCommandsHandler } from "../handlers/basic-handler-module.js";
import { OSCommandsHandler } from "../handlers/os-handler-module.js";
import { stdin, stdout } from "process";

export class InputInterceptor {
  constructor(fileManager) {
    this.fileManager = fileManager;
  }

  setExitListener() {
    process.on("SIGINT", () => {
      stdout.write(this.fileManager.exitMessage);
      process.exit();
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
    if (BASIC_COMMANDS.includes(data[0])) {
      const basicHandler = new BasicCommandsHandler(this.fileManager, data);
      basicHandler.handleCommand();
      return;
    }

    if (NAVIGATION_COMMANDS.includes(data[0])) {
      const navigationHandler = new NavigationCommandsHandler(
        this.fileManager,
        data
      );
      navigationHandler.handleCommand();
      return;
    }

    if (data[0] === "os") {
      const OSHandler = new OSCommandsHandler(this.fileManager, data);
      OSHandler.handleCommand();
      return;
    }

    console.log("Operation failed! Unknown command");
    console.log(this.fileManager.currentUrlMessage);
    stdin.resume();
  }

  initInterceptor() {
    console.log(this.fileManager.welcomeMessage);
    console.log(this.fileManager.currentUrlMessage);

    this.setExitListener();
    this.setInputListener();
  }
}
