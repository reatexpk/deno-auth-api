import { Context } from "https://deno.land/x/oak@v12.6.0/mod.ts";

import * as UserService from "../services/auth-service.ts";

import { ErrorResponse, OkResponse } from "../helpers/responses.ts";
import { LoginRequest, RegisterRequest } from "../types/auth.ts";

export async function loginController(ctx: Context) {
  try {
    const request: LoginRequest = await ctx.request.body({ type: "json" })
      .value;
    const session = await UserService.loginUser(request);
    ctx.response.body = new OkResponse(session);
  } catch (e) {
    ctx.response.body = new ErrorResponse(e.message);
    return;
  }
}

export async function registerController(ctx: Context) {
  try {
    const request: RegisterRequest = await ctx.request.body({ type: "json" })
      .value;
    const user = await UserService.registerUser(request);
    ctx.response.body = new OkResponse(user);
  } catch (e) {
    ctx.response.body = new ErrorResponse(e.message);
    return;
  }
}

export async function refreshTokenController(ctx: Context) {}
