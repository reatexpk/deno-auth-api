import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { verify } from "https://deno.land/x/djwt@v2.9.1/mod.ts";

import * as UserRepository from "../../repositories/user-repository.ts";

import { getAuthToken, getRefreshToken, key } from "../../helpers/jwt.ts";
import { LoginRequest, RegisterRequest, Session } from "../../types/auth.ts";
import {
  GenericAuthError,
  RefreshTokenInvalidError,
  RegistrationError,
  WrongCredentialsError,
} from "./errors.ts";

/**
 * Tries to find user and generates a pair of tokens for them
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
    const accessTokenPromise = getAuthToken({ userId: user.id.toString() });
    const refreshTokenPromise = getRefreshToken(user.id.toString());
    const [accessToken, refreshToken] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);
    await UserRepository.saveRefreshToken(refreshToken);
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
 * @returns Pair of tokens & just created user
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
      userId: createdUser.id.toString(),
    });
    const refreshTokenPromise = getRefreshToken(createdUser.id.toString());
    const [accessToken, refreshToken] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);
    await UserRepository.saveRefreshToken(refreshToken);
    return { accessToken, refreshToken, id: createdUser.id.toString() };
  } catch (e) {
    console.error(e);
    const error = e instanceof GenericAuthError ||
        e instanceof RegistrationError
      ? e
      : new GenericAuthError();
    throw error;
  }
}

/**
 * Checks if user's refresh token is valid and creates a new pair of tokens for them
 * @param refreshToken refresh token
 * @returns Pair of tokens
 * @throws {RefreshTokenInvalidError}
 */
export async function refreshToken(refreshToken: string): Promise<Session> {
  try {
    const { userId } = await verify(refreshToken, key);
    if (typeof userId !== "string") {
      throw new Error();
    }
    const user = await UserRepository.getUserById(userId);
    const isRefreshTokenValid = user?.refreshToken === refreshToken;
    if (!isRefreshTokenValid) {
      throw new Error();
    }
    const accessTokenPromise = getAuthToken({ userId });
    const refreshTokenPromise = getRefreshToken(userId);
    const [newAccessToken, newRefreshToken] = await Promise.all([
      accessTokenPromise,
      refreshTokenPromise,
    ]);
    await UserRepository.saveRefreshToken(newRefreshToken);
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (e) {
    console.log(e);
    throw new RefreshTokenInvalidError();
  }
}
