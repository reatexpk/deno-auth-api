import { provide } from "https://deno.land/x/microdi@v0.0.3/Provider.ts";

import { AuthController } from "../controllers/auth-controller.ts";
import { AuthService } from "../services/auth/auth-service.ts";
import { UserRepository } from "../repositories/user/user-repository.ts";

provide(AuthController, [AuthService]);
provide(AuthService, [UserRepository]);
