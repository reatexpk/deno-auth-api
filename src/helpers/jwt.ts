import {
  create,
  getNumericDate,
  Header,
} from "https://deno.land/x/djwt@v2.9.1/mod.ts";

const key = await crypto.subtle.generateKey(
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

export async function getRefreshToken() {
  const jwt = await create(header, {
    exp: getNumericDate(REFRESH_TOKEN_EXP_TIME_SEC),
  }, key);
  return jwt;
}
