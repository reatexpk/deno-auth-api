import { Context } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import { Status } from "https://deno.land/std@0.193.0/http/http_status.ts";

import { AuthService } from "../services/auth/auth-service.ts";

import { ErrorResponse, OkResponse } from "../helpers/responses.ts";
import {
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
} from "../types/auth.ts";

export class AuthController {
  public constructor(private readonly _authService: AuthService) {}

  public async login(ctx: Context) {
    try {
      const request: LoginRequest = await ctx.request.body({ type: "json" })
        .value;
      const session = await this._authService.loginUser(request);
      ctx.response.body = new OkResponse(session);
    } catch (e) {
      ctx.response.body = new ErrorResponse(e.message);
    }
  }

  public async register(ctx: Context) {
    try {
      const request: RegisterRequest = await ctx.request.body({ type: "json" })
        .value;
      const user = await this._authService.registerUser(request);
      ctx.response.body = new OkResponse(user);
    } catch (e) {
      ctx.response.body = new ErrorResponse(e.message);
    }
  }

  public async refreshToken(ctx: Context) {
    try {
      const request: RefreshTokenRequest = await ctx.request.body({
        type: "json",
      }).value;
      const session = await this._authService.refreshToken(
        request.refreshToken
      );
      ctx.response.body = new OkResponse(session);
    } catch (e) {
      ctx.response.status = Status.Unauthorized;
      ctx.response.body = new ErrorResponse(e.message);
    }
  }
}
