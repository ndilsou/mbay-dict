import { SSTConfig } from "sst";
import { App } from "sst/constructs/App";
import { Main } from "./stacks/main";

export default {
  config(_input) {
    return {
      name: "cloud",
      region: "eu-west-1",
    };
  },
  stacks(app: App) {
    app.stack(Main);
  },
} satisfies SSTConfig;
