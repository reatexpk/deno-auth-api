import { Database } from "../db/db.ts";

export interface CreateUser {
  login: string;
  encryptedPassword: string;
  salt: string;
}

export type User = CreateUser & { id: number; refreshToken?: string };

export async function createUser(user: CreateUser): Promise<User | null> {
  const client = await Database.getClient();
  await client.queryObject<User>({
    camelcase: true,
    text: `
      INSERT INTO users_table (login, encrypted_password, salt)
      VALUES ('${user.login}', '${user.encryptedPassword}', '${user.salt}')
    `,
  });
  return getUserByLogin(user.login);
}

export async function getUserByLogin(
  login: string,
): Promise<User | null> {
  const client = await Database.getClient();
  const result = await client.queryObject<User>({
    camelcase: true,
    text: `SELECT * FROM users_table WHERE login = '${login}'`,
  });
  const [user] = result.rows;
  return user;
}

export async function getUserById(
  id: string,
): Promise<User | null> {
  const client = await Database.getClient();
  const result = await client.queryObject<User>({
    camelcase: true,
    text: `SELECT * FROM users_table WHERE id = ${id}`,
  });
  const [user] = result.rows;
  return user;
}

export async function saveRefreshToken(refreshToken: string): Promise<void> {
  const client = await Database.getClient();
  await client.queryArray`
    UPDATE users_table
    SET refresh_token = ${refreshToken}
  `;
}
