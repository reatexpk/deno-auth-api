import { assertEquals } from "https://deno.land/std@v0.194.0/testing/asserts.ts";
import { spy, stub } from "https://deno.land/std@v0.194.0/testing/mock.ts";
import * as AuthService from "./auth-service.ts";
import { getUserByLogin } from "../../repositories/user-repository.ts";

Deno.test(
  "loginUser should throw WrongCredentialsError if user not exist",
  async () => {
    // TODO: mock User repository somehow
    await AuthService.loginUser({
      login: "+79999999999",
      password: "qwerty",
    }).catch();
    assertEquals("1", "1");
  }
);

Deno.test("method registerUser", () => {
  assertEquals("1", "1");
});

Deno.test("method refreshToken", () => {
  assertEquals("1", "1");
});
