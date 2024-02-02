import { FileManager } from "./file-manager.js";
import { InputInterceptor } from "./input-interceptor.js";

const NAME_PROP = "--username=";

const initFileManagerCore = async () => {
  //TODO: ADD HANDLER WHEN USER DONT WRITE NAME
  const userName = process.argv
    .slice(2)
    .find((arg) => arg.startsWith(NAME_PROP))
    .replace(NAME_PROP, "");

  const fileManager = new FileManager(import.meta.url, userName);
  const interceptor = new InputInterceptor(fileManager);

  interceptor.initInterceptor();
};

initFileManagerCore();
