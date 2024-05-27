import {
  CreateUser,
  IUserRepository,
  User,
} from "../../../repositories/user/user-repository.ts";

export class UserRepositoryMock implements IUserRepository {
  createUser(user: CreateUser): Promise<User | null> {
    return Promise.resolve({
      id: 0,
      login: "+79999999999",
      encryptedPassword: "qwertyuiop",
      salt: "asdfghjkl",
      refreshToken: "zxcvbnm",
    });
  }

  getUserById(id: string): Promise<User | null> {
    return Promise.resolve({
      id: 0,
      login: "+79999999999",
      encryptedPassword: "qwertyuiop",
      salt: "asdfghjkl",
      refreshToken: "zxcvbnm",
    });
  }

  getUserByLogin(login: string): Promise<User | null> {
    return Promise.resolve({
      id: 0,
      login: "+79999999999",
      encryptedPassword: "qwertyuiop",
      salt: "asdfghjkl",
      refreshToken: "zxcvbnm",
    });
  }

  saveRefreshToken(refreshToken: string): Promise<void> {
    return Promise.resolve(undefined);
  }
}

export class UserRepositoryFailedMock implements IUserRepository {
  createUser(user: CreateUser): Promise<User | null> {
    return Promise.resolve(null);
  }

  getUserById(id: string): Promise<User | null> {
    return Promise.resolve(null);
  }

  getUserByLogin(login: string): Promise<User | null> {
    return Promise.resolve(null);
  }

  saveRefreshToken(refreshToken: string): Promise<void> {
    return Promise.resolve(undefined);
  }
}
