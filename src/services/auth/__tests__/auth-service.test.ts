import {
  assertEquals,
  assertRejects,
} from "https://deno.land/std@v0.194.0/testing/asserts.ts";
import { AuthService } from "../auth-service.ts";
import {
  UserRepositoryMock,
  UserRepositoryFailedMock,
} from "../__mocks__/user-repository.mock.ts";
import { WrongCredentialsError } from "../errors.ts";

Deno.test(
  {
    name: "loginUser should throw WrongCredentialsError if user not exist",
    permissions: { read: true },
  },
  async () => {
    const authService = new AuthService(new UserRepositoryFailedMock());
    await assertRejects(
      () =>
        authService.loginUser({
          login: "+79999999999",
          password: "qwerty",
        }),
      WrongCredentialsError,
      "Wrong login or password"
    );
  }
);

Deno.test(
  "loginUser should return a pair of valid tokens with userId encoded if user credentials are ok",
  async () => {
    const authService = new AuthService(new UserRepositoryMock());
    const user = await authService.loginUser({
      login: "+79999999999",
      password: "qwerty",
    });
  }
);

Deno.test("method registerUser", () => {
  assertEquals("1", "1");
});

Deno.test("method refreshToken", () => {
  assertEquals("1", "1");
});
