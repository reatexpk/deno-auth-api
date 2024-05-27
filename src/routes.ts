import { Router } from "https://deno.land/x/oak@v12.6.0/mod.ts";

import { AuthController } from "./controllers/auth-controller.ts";
import * as UserControllers from "./controllers/user-controllers.ts";

import { validationMiddleware } from "./middlewares/validation-middleware.ts";
import { authMiddleware } from "./middlewares/auth-middleware.ts";

import { authValidationSchema } from "./validations/auth-validations.ts";

export class AppRouter {
  private readonly _router = new Router();

  public constructor(private readonly _authController: AuthController) {}

  public createRouter() {
    const router = this._router;

    router
      .post(
        "/auth/login",
        validationMiddleware(authValidationSchema),
        this._authController.login.bind(this._authController)
      )
      .post(
        "/auth/register",
        validationMiddleware(authValidationSchema),
        this._authController.register.bind(this._authController)
      )
      .post(
        "/auth/refresh",
        this._authController.refreshToken.bind(this._authController)
      );

    router.get("/me", authMiddleware, UserControllers.getMeController);

    return router;
  }
}
