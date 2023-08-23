import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    MONGO_PASSWORD: z.string().min(1),
    MONGO_USERNAME: z.string().min(1),
    MONGO_URI: z.string().url(),
  },
  //   client: {},
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  //   runtimeEnv: {
  //     MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  //     MONGO_USERNAME: process.env.MONGO_USERNAME,
  //   },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {},
  // experimental__runtimeEnv: {
  //   NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  // }
});
