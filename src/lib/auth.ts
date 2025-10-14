import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./server/db";
import { betterAuth } from "better-auth";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  appName: "quran-digital",
  plugins: [sveltekitCookies(getRequestEvent)],
  emailAndPassword: {
    enabled: true
  }
});
