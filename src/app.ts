import { Application } from "https://deno.land/x/oak@v12.6.0/mod.ts";

import { loggerMiddleware } from "./middlewares/logger-middleware.ts";

import { router } from "./routes.ts";
import { getEnv } from "./helpers/get-env.ts";

const { APP_HOST, APP_PORT } = await getEnv();

export async function startApp() {
  const app = new Application();

  app.addEventListener("error", (evt) => {
    console.error(evt.error);
  });

  app.use(loggerMiddleware);
  app.use(router.routes());
  app.use((ctx) => {
    ctx.response.status = 404;
    ctx.response.body = { value: null, error: "NOT_FOUND" };
  });

  console.log(`Starting server on ${APP_HOST}:${APP_PORT}`);

  await app.listen({ hostname: APP_HOST, port: APP_PORT });
}

startApp();
