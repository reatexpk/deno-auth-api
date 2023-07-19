import { Router } from "https://deno.land/x/oak@v12.6.0/mod.ts";

import * as AuthControllers from "./controllers/auth-controllers.ts";
import * as UserControllers from "./controllers/user-controllers.ts";

import { validationMiddleware } from "./middlewares/validation-middleware.ts";
import { authMiddleware } from "./middlewares/auth-middleware.ts";

import { authValidationSchema } from "./validations/auth-validations.ts";

const router = new Router();

router
  .post(
    "/auth/login",
    validationMiddleware(authValidationSchema),
    AuthControllers.loginController,
  )
  .post(
    "/auth/register",
    validationMiddleware(authValidationSchema),
    AuthControllers.registerController,
  )
  .post("/auth/refresh", AuthControllers.refreshTokenController);

router.get("/me", authMiddleware, UserControllers.getMeController);

export { router };
