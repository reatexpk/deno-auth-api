import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

export class Database {
  static #client: Client | null = null;

  public static async getClient(): Promise<Client> {
    if (!Database.#client) {
      Database.#client = new Client({
        user: "deno",
        password: "deno-api-password",
        database: "test",
        hostname: "localhost",
        port: 5432,
      });
    }

    if (!Database.#client.connected) {
      await Database.#client.connect();
    }

    return Database.#client;
  }

  private constructor() {}
}
