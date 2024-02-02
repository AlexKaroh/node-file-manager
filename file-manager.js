import { fileURLToPath } from "url";
import { join, dirname } from "path";

export class FileManager {
  constructor(triggerUrl, userName) {
    this.currDir = this.setCurrentPath(triggerUrl);
    this.userName = userName;
  }

  setCurrentPath(sourcePatch, dirName = "") {
    const baseDir = dirname(fileURLToPath(sourcePatch));
    return dirName ? join(baseDir, dirName) : baseDir;
  }

  get welcomeMessage() {
    return `Welcome to the File Manager, ${this.userName}!`;
  }

  get exitMessage() {
    return `Thank you for using File Manager, ${this.userName}, goodbye!`;
  }

  get currentDir() {
    return `You are currently in ${this.currDir}`;
  }
}
