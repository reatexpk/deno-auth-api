import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

import * as UserRepository from "../repositories/user-repository.ts";

import { getAuthToken, getRefreshToken } from "../helpers/jwt.ts";
import { LoginRequest, RegisterRequest, Session } from "../types/auth.ts";

class RegistrationError extends Error {
  public constructor() {
    super("Cannot register new user");
  }
}

class WrongCredentialsError extends Error {
  public constructor() {
    super("Wrong login or password");
  }
}

class GenericAuthError extends Error {
  public constructor() {
    super("Cannot authenticate");
  }
}

/**
 * Tries to find the user and generates a pair of tokens for them
 * @param userData Login and password sent by user
 * @returns Session – pair of tokens
 * @throws {WrongCredentialsError, GenericAuthError}
 */
export async function loginUser(
  userData: LoginRequest,
): Promise<Session> {
  try {
    const user = await UserRepository.getUserByLogin(userData.login);
    if (!user) {
      throw new WrongCredentialsError();
    }
    const result = await bcrypt.compare(
      userData.password,
      user.encryptedPassword,
    );
    if (!result) {
      throw new WrongCredentialsError();
    }
    const accessTokenPromise = getAuthToken({ userId: user.id, foo: "bar" });
    const refreshTokenPromise = getRefreshToken();
    const [accessToken, refreshToken] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);
    return { accessToken, refreshToken };
  } catch (e) {
    console.error(e);
    const error =
      e instanceof WrongCredentialsError || e instanceof GenericAuthError
        ? e
        : new GenericAuthError();
    throw error;
  }
}

/**
 * Register user with their login and password
 * @param userData Login and password sent by user
 * @returns Session – pair of tokens & just created user
 * @throws {RegistrationError, GenericAuthError}
 */
export async function registerUser(
  userData: RegisterRequest,
): Promise<Session & { id: string }> {
  try {
    const salt = await bcrypt.genSalt(8);
    const encryptedPassword = await bcrypt.hash(userData.password, salt);
    const newUser: UserRepository.CreateUser = {
      login: userData.login,
      encryptedPassword,
      salt,
    };
    const createdUser = await UserRepository.createUser(newUser);
    if (!createdUser) {
      throw new RegistrationError();
    }
    const accessTokenPromise = getAuthToken({
      userId: createdUser.id,
      foo: "bar",
    });
    const refreshTokenPromise = getRefreshToken();
    const [accessToken, refreshToken] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);
    return { accessToken, refreshToken, id: createdUser.id };
  } catch (e) {
    console.error(e);
    const error = e instanceof GenericAuthError ||
        e instanceof RegistrationError
      ? e
      : new GenericAuthError();
    throw error;
  }
}
