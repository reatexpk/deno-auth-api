import { Context } from "https://deno.land/x/oak@v12.6.0/mod.ts";
import { OkResponse } from "../helpers/responses.ts";

export async function getMeController(ctx: Context) {
  ctx.response.body = new OkResponse("Not implemented");
}
