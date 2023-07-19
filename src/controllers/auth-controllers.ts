import { Context } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import { Status } from "https://deno.land/std@0.193.0/http/http_status.ts";

import * as AuthService from "../services/auth/auth-service.ts";

import { ErrorResponse, OkResponse } from "../helpers/responses.ts";
import {
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
} from "../types/auth.ts";

export async function loginController(ctx: Context) {
  try {
    const request: LoginRequest = await ctx.request.body({ type: "json" })
      .value;
    const session = await AuthService.loginUser(request);
    ctx.response.body = new OkResponse(session);
  } catch (e) {
    ctx.response.body = new ErrorResponse(e.message);
  }
}

export async function registerController(ctx: Context) {
  try {
    const request: RegisterRequest = await ctx.request.body({ type: "json" })
      .value;
    const user = await AuthService.registerUser(request);
    ctx.response.body = new OkResponse(user);
  } catch (e) {
    ctx.response.body = new ErrorResponse(e.message);
  }
}

export async function refreshTokenController(ctx: Context) {
  try {
    const request: RefreshTokenRequest = await ctx.request.body({
      type: "json",
    })
      .value;
    const session = await AuthService.refreshToken(request.refreshToken);
    ctx.response.body = new OkResponse(session);
  } catch (e) {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = new ErrorResponse(e.message);
  }
}
