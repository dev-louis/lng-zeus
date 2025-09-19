import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { apiKey, openAPI } from "better-auth/plugins";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  plugins: [
    openAPI(),
    apiKey({
      rateLimit: {
        enabled: true,
        timeWindow: 60 * 1000, // 1 minute
        maxRequests: 1000,
      },
    }),
  ],
});
