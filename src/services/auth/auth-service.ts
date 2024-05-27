import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { verify } from "https://deno.land/x/djwt@v2.9.1/mod.ts";

import {
  type CreateUser,
  type IUserRepository,
  UserRepository,
} from "../../repositories/user/user-repository.ts";

import { getAuthToken, getRefreshToken, key } from "../../helpers/jwt.ts";
import { LoginRequest, RegisterRequest, Session } from "../../types/auth.ts";
import {
  GenericAuthError,
  RefreshTokenInvalidError,
  RegistrationError,
  WrongCredentialsError,
} from "./errors.ts";

export class AuthService {
  public constructor(
    private readonly _userRepository: IUserRepository = new UserRepository(),
  ) {}

  /**
   * Tries to find user and generates a pair of tokens for them
   * @param userData Login and password sent by user
   * @returns Session – pair of tokens
   * @throws {WrongCredentialsError, GenericAuthError}
   */
  public async loginUser(
    userData: LoginRequest,
    dependencies: {
      userRepository: IUserRepository;
      compareFn: typeof bcrypt.compare;
      getAuthToken: (payload?: Record<string, string>) => Promise<string>;
      getRefreshToken: (userId: string) => Promise<string>;
    } = {
      userRepository: this._userRepository,
      compareFn: bcrypt.compare,
      getAuthToken: getAuthToken,
      getRefreshToken: getRefreshToken,
    },
  ): Promise<Session> {
    try {
      const user = await dependencies.userRepository.getUserByLogin(
        userData.login,
      );
      if (!user) {
        throw new WrongCredentialsError();
      }
      const result = await dependencies.compareFn(
        userData.password,
        user.encryptedPassword,
      );
      if (!result) {
        throw new WrongCredentialsError();
      }
      const accessTokenPromise = dependencies.getAuthToken({
        userId: user.id.toString(),
      });
      const refreshTokenPromise = dependencies.getRefreshToken(
        user.id.toString(),
      );
      const [accessToken, refreshToken] = await Promise.all([
        accessTokenPromise,
        refreshTokenPromise,
      ]);
      await dependencies.userRepository.saveRefreshToken(refreshToken);
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
  public async registerUser(
    userData: RegisterRequest,
  ): Promise<Session & { id: string }> {
    try {
      const salt = await bcrypt.genSalt(8);
      const encryptedPassword = await bcrypt.hash(userData.password, salt);
      const newUser: CreateUser = {
        login: userData.login,
        encryptedPassword,
        salt,
      };
      const createdUser = await this._userRepository.createUser(newUser);
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
      await this._userRepository.saveRefreshToken(refreshToken);
      return { accessToken, refreshToken, id: createdUser.id.toString() };
    } catch (e) {
      console.error(e);
      const error =
        e instanceof GenericAuthError || e instanceof RegistrationError
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
  public async refreshToken(refreshToken: string): Promise<Session> {
    try {
      const { userId } = await verify(refreshToken, key);
      if (typeof userId !== "string") {
        throw new Error();
      }
      const user = await this._userRepository.getUserById(userId);
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
      await this._userRepository.saveRefreshToken(newRefreshToken);
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (e) {
      console.log(e);
      throw new RefreshTokenInvalidError();
    }
  }
}
