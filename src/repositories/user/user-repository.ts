import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

import { Database } from "../../db/db.ts";

export interface CreateUser {
  login: string;
  encryptedPassword: string;
  salt: string;
}

export type User = CreateUser & { id: number; refreshToken?: string };

export interface IUserRepository {
  createUser(user: CreateUser): Promise<User | null>;
  getUserByLogin(login: string): Promise<User | null>;
  getUserById(id: string): Promise<User | null>;
  saveRefreshToken(refreshToken: string): Promise<void>;
}

export class UserRepository implements IUserRepository {
  private readonly _client: Promise<Client> = Database.getClient();

  public async createUser(user: CreateUser): Promise<User | null> {
    const client = await this._client;
    await client.queryObject<User>({
      camelcase: true,
      text: `
        INSERT INTO users_table (login, encrypted_password, salt)
        VALUES ('${user.login}', '${user.encryptedPassword}', '${user.salt}')
      `,
    });
    return this.getUserByLogin(user.login);
  }

  public async getUserByLogin(login: string): Promise<User | null> {
    const client = await this._client;
    const result = await client.queryObject<User>({
      camelcase: true,
      text: `SELECT * FROM users_table WHERE login = '${login}'`,
    });
    const [user] = result.rows;
    return user;
  }

  public async getUserById(id: string): Promise<User | null> {
    const client = await this._client;
    const result = await client.queryObject<User>({
      camelcase: true,
      text: `SELECT * FROM users_table WHERE id = ${id}`,
    });
    const [user] = result.rows;
    return user;
  }

  public async saveRefreshToken(refreshToken: string): Promise<void> {
    const client = await this._client;
    await client.queryArray`
      UPDATE users_table
      SET refresh_token = ${refreshToken}
    `;
  }
}
