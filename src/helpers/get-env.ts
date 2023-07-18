import { load } from "https://deno.land/std@0.194.0/dotenv/mod.ts";

interface AppEnvs {
  APP_HOST: string;
  APP_PORT: number;
}

const DEFAULT_APP_HOST = "0.0.0.0";
const DEFAULT_APP_PORT = 8000;

export async function getEnv(): Promise<AppEnvs> {
  const env = await load();
  const APP_HOST = env["APP_HOST"] || DEFAULT_APP_HOST;
  const APP_PORT = !Number.isNaN(Number(env["APP_PORT"]))
    ? Number(env["APP_PORT"])
    : DEFAULT_APP_PORT;

  return { APP_HOST, APP_PORT };
}
