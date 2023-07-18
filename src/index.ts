import { Application } from "https://deno.land/x/oak@v12.6.0/mod.ts";

import { logger } from "./logger.ts";
import { router } from "./routes.ts";
import { getEnv } from "./helpers/get-env.ts";

export async function startApp() {
  const { APP_HOST, APP_PORT } = await getEnv();

  const app = new Application();

  app.addEventListener("error", (evt) => {
    console.error(evt.error);
  });

  app.use(logger);
  app.use(router.routes());
  app.use((ctx) => {
    ctx.response.status = 404;
    ctx.response.body = { value: null, error: "NOT_FOUND" };
  });

  console.log(`Starting server on ${APP_HOST}:${APP_PORT}`);

  await app.listen({ hostname: APP_HOST, port: APP_PORT });
}

startApp();
