import { createHash } from "crypto";
import { createReadStream } from "fs";
import { stdin } from "process";

export class HashCommandsHandler {
  constructor(fileManager, data) {
    this.fileManager = fileManager;
    this.data = data;
  }

  handleCommand() {
    if (this.data.length > 2) {
      console.log(`Operation failed! Unknown ${this.data[2]} argument`);
      console.log(this.fileManager.currentUrlMessage);
      stdin.resume();
      return;
    }
    switch (this.data[0]) {
      case "hash": {
        this.calculateFileHash(this.data[1]);
      }
    }
  }

  calculateFileHash(filePath) {
    if (!filePath) {
      console.log(`Operation failed! File path can't be empty`);
      console.log(this.fileManager.currentUrlMessage);
      stdin.resume();
      return;
    }

    const hash = createHash("sha256");
    const fileStream = createReadStream(filePath);

    fileStream.on("data", (data) => {
      hash.update(data);
    });

    fileStream.on("end", () => {
      console.log(`Hash: ${hash.digest("hex")}`);
      console.log(this.fileManager.currentUrlMessage);
    });

    fileStream.on("error", (error) => {
      console.error(`Operation failed: ${error}`);
      console.log(this.fileManager.currentUrlMessage);
    });
  }
}
