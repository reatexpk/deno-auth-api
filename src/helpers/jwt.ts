import {
  create,
  getNumericDate,
  Header,
} from "https://deno.land/x/djwt@v2.9.1/mod.ts";

import { getEnv } from "./get-env.ts";

await getEnv(); // this MUST be called here to set up Deno.env before using it
const JWT_KEY = Deno.env.get("JWT_KEY");
const keyBuff = new TextEncoder().encode(JWT_KEY);

export const key = await crypto.subtle.importKey(
  "raw",
  keyBuff,
  { name: "HMAC", hash: "SHA-512" },
  true,
  ["sign", "verify"],
);

const ACCESS_TOKEN_EXP_TIME_SEC = 60 * 5; // 5 minutes
const REFRESH_TOKEN_EXP_TIME_SEC = 60 * 60; // 1 hour

const header: Header = {
  alg: "HS512",
  typ: "JWT",
};

export async function getAuthToken(
  payload: Record<string, string> = {},
): Promise<string> {
  const jwt = await create(header, {
    ...payload,
    exp: getNumericDate(ACCESS_TOKEN_EXP_TIME_SEC),
  }, key);
  return jwt;
}

export async function getRefreshToken(userId: string) {
  const jwt = await create(header, {
    userId,
    exp: getNumericDate(REFRESH_TOKEN_EXP_TIME_SEC),
  }, key);
  return jwt;
}
