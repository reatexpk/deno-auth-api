import { Router } from "https://deno.land/x/oak@v12.6.0/mod.ts";

import * as authControllers from "./controllers/auth-controllers.ts";
import * as userControllers from "./controllers/user-controllers.ts";

import { authValidationSchema } from "./validations/auth-validations.ts";
import { validationMiddleware } from "./middlewares/validation-middleware.ts";

const router = new Router();

router
  .post(
    "/auth/login",
    validationMiddleware(authValidationSchema),
    authControllers.loginController,
  )
  .post(
    "/auth/register",
    validationMiddleware(authValidationSchema),
    authControllers.registerController,
  )
  .post("/auth/refresh", authControllers.refreshTokenController);

router.get("/me", userControllers.getMeController);

export { router };
