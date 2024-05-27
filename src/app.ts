import { provide } from "https://deno.land/x/microdi@v0.0.3/Provider.ts";
import { resolve } from "https://deno.land/x/microdi@v0.0.3/Resolver.ts";
import { Application } from "https://deno.land/x/oak@v12.6.0/mod.ts";

import { AuthController } from "./controllers/auth-controller.ts";
import { getEnv } from "./helpers/get-env.ts";
import { loggerMiddleware } from "./middlewares/logger-middleware.ts";
import { UserRepository } from "./repositories/user/user-repository.ts";
import { AppRouter } from "./routes.ts";
import { AuthService } from "./services/auth/auth-service.ts";

const { APP_HOST, APP_PORT } = await getEnv();

export class App {
  public constructor(private readonly _authController: AuthController) {}

  public async start() {
    const app = new Application();

    app.addEventListener("error", (evt) => {
      console.error(evt.error);
    });

    const router = new AppRouter(this._authController).createRouter();

    app.use(loggerMiddleware);
    app.use(router.routes());
    app.use((ctx) => {
      ctx.response.status = 404;
      ctx.response.body = { value: null, error: "NOT_FOUND" };
    });

    console.log(`Starting server on ${APP_HOST}:${APP_PORT}`);

    await app.listen({ hostname: APP_HOST, port: APP_PORT });
  }
}

function registerDeps() {
  return new Promise((resolve) => {
    console.log("registering deps");
    provide(App, [AuthController]);
    provide(AuthController, [AuthService]);
    provide(AuthService, [UserRepository]);
    provide(UserRepository, []);
    resolve(void 0);
  });
}

registerDeps().then(() => {
  console.log("resolving app and starting");
  resolve(App).start();
});
