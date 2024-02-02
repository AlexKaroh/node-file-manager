import { fileURLToPath } from "url";
import { join, dirname } from "path";

export class FileManager {
  constructor(triggerUrl, userName) {
    this.currentPath$ = this.setCurrentPath(triggerUrl);
    this.userName = userName;
  }

  /**
   * @param {string} sourcePatch The path to set as the current path.
   * @param {string} dirName Subdirectory name, if necessary.
   * @returns {string} Returns the set current path.
   */

  setCurrentPath(sourcePatch, dirName = "") {
    const baseDir = dirname(fileURLToPath(sourcePatch));
    return dirName ? join(baseDir, dirName) : baseDir;
  }

  /**
   * @param {string} path
   */
  set currentPath(path) {
    this.currentPath$ = path;
  }

  get currentPath() {
    return this.currentPath$;
  }

  get welcomeMessage() {
    return `Welcome to the File Manager, ${this.userName}!`;
  }

  get exitMessage() {
    return `Thank you for using File Manager, ${this.userName}, goodbye!`;
  }

  get currentUrlMessage() {
    return `You are currently in ${this.currentPath$}`;
  }
}
