import os from "os";
import { stdin } from "process";

export class OSCommandsHandler {
  constructor(fileManager, data) {
    this.fileManager = fileManager;
    this.data = data;
  }

  handleCommand() {
    if (this.data.length > 2) {
      console.log(`Invalid input! Unknown ${this.data[2]} os command argunemt`);
      console.log(this.fileManager.currentUrlMessage);
      stdin.resume();
      return;
    }
    switch (this.data[1]) {
      case "--EOL": {
        this.getEOL();
        stdin.resume();
        break;
      }
      case "--cpus": {
        this.getCPUsInfo();
        stdin.resume();
        break;
      }
      case "--homedir": {
        this.getHomeDirectory();
        stdin.resume();
        break;
      }
      case "--username": {
        this.getUsername();
        stdin.resume();
        break;
      }
      case "--architecture": {
        this.getArchitecture();
        stdin.resume();
        break;
      }
      default: {
        console.log(`Invalid input! Unknown ${this.data[1]} os argunemt`);
        console.log(this.fileManager.currentUrlMessage);
        stdin.resume();
        break;
      }
    }
  }

  getArchitecture() {
    console.log(
      `CPU architecture for which Node.js binary has compiled: ${os.arch()}`
    );
    console.log(this.fileManager.currentUrlMessage);
  }

  getUsername() {
    console.log(`Current system user name: ${os.userInfo().username}`);
    console.log(this.fileManager.currentUrlMessage);
  }

  getHomeDirectory() {
    console.log(`Home directory: ${os.homedir()}`);
    console.log(this.fileManager.currentUrlMessage);
  }

  getCPUsInfo() {
    const cpus = os.cpus();

    if (!cpus.length) {
      console.log(`Overall amount of CPUS: 0`);
      console.log(this.fileManager.currentUrlMessage);
      return;
    }

    console.log(`Overall amount of CPUS: ${cpus.length}`);
    cpus.forEach((cpu, index) => {
      console.log(`CPU ${index + 1}:`);
      console.log(`  Model: ${cpu.model}`);
      console.log(`  Clock rate: ${cpu.speed / 1000} GHz`);
    });
    console.log(this.fileManager.currentUrlMessage);
  }

  getEOL() {
    console.log(
      `End-Of-Line (EOL) for the current system: '${JSON.stringify(os.EOL)}'`
    );
    console.log(this.fileManager.currentUrlMessage);
  }
}
