import { SSTConfig } from "sst";
import { App } from "sst/constructs/App";
import { Main } from "./stacks/main";

export default {
  config(_input) {
    return {
      name: "mbay-dictionary",
      region: "eu-west-1",
      profile: "mbay-sso"
    };
  },
  stacks(app: App) {
    app.stack(Main);
  },
} satisfies SSTConfig;
