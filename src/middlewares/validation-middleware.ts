import { Status } from "https://deno.land/std@0.193.0/http/http_status.ts";
import { RouterContext } from "https://deno.land/x/oak@v12.6.0/router.ts";
import {
  firstMessages,
  validate,
  ValidationRules,
} from "https://deno.land/x/validasaur@v0.15.0/mod.ts";

import { ErrorResponse } from "../helpers/responses.ts";

export function validationMiddleware(validationSchema: ValidationRules) {
  return async (ctx: RouterContext<string>, next: () => Promise<unknown>) => {
    const reqBody = await ctx.request.body({ type: "json" }).value;
    const [passes, errors] = await validate(reqBody, validationSchema);

    if (!passes) {
      const validationErrors = Object.values(firstMessages(errors)).join(", ");
      ctx.response.status = Status.BadRequest;
      ctx.response.body = new ErrorResponse(validationErrors);
      return;
    }

    await next();
  };
}
