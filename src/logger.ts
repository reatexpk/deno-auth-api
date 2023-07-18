import { Context, Next } from "https://deno.land/x/oak@v12.6.0/mod.ts";

export async function logger(ctx: Context, next: Next) {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  console.log(`${ctx.request.method} ${ctx.request.url} - ${ms} ms`);
}
