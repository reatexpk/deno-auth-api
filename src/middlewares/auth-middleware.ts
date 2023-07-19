import { Status } from "https://deno.land/std@0.193.0/http/http_status.ts";
import { Context, Next } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import { verify } from "https://deno.land/x/djwt@v2.9.1/mod.ts";

import { ErrorResponse } from "../helpers/responses.ts";
import { key } from "../helpers/jwt.ts";

export async function authMiddleware(ctx: Context, next: Next) {
  const authHeader = ctx.request.headers.get("Authorization");
  if (!authHeader) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = new ErrorResponse("Unauthorized");
    return;
  }
  try {
    const token = authHeader.replace(/^bearer/i, "").trim();
    const payload = await verify(token, key);
    ctx.state.userId = payload.userId;
    await next();
  } catch {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = new ErrorResponse("Unauthorized");
  }
}
