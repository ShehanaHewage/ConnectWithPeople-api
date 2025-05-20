import sql from "./conn.ts";
import type { User } from "../models/entities.ts";
import { objectToCamelCaseKeys, objectToSnakeCaseKeys } from "../utils/objectUtils.ts";

const TABLE_NAME = "users";

export const userRepo = {
  async getUserByUsername(username: string): Promise<User | null> {
    const result = await sql<User[]>`
      SELECT * FROM ${sql(TABLE_NAME)}
      WHERE username = ${username}
    `;
    return result.length > 0 ? objectToCamelCaseKeys(result[0]) : null;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await sql<User[]>`
      SELECT * FROM ${sql(TABLE_NAME)}
      WHERE email = ${email}
    `;
    return result.length > 0 ? objectToCamelCaseKeys(result[0]) : null;
  },

  async getUserById(userId: string): Promise<User | null> {
    const result = await sql<User[]>`
      SELECT * FROM ${sql(TABLE_NAME)}
      WHERE user_id = ${userId}
    `;
    return result.length > 0 ? objectToCamelCaseKeys(result[0]) : null;
  },

  async createUser(userData: User): Promise<User> {
    const snakeCaseData = objectToSnakeCaseKeys(userData);

    const result = await sql<User[]>`
      INSERT INTO ${sql(TABLE_NAME)} ${sql(snakeCaseData)}
      RETURNING *
    `;
    if (result.length === 0) {
        throw new Error("User creation failed, no record returned.");
    }
    return objectToCamelCaseKeys(result[0]);
  },

  async updateUser(userId: string, updateData: User): Promise<User | null> {
    if (Object.keys(updateData).length === 0) {
      return this.getUserById(userId);
    }

    const snakeCaseData = objectToSnakeCaseKeys(updateData);
    snakeCaseData.updated_at = new Date();

    const result = await sql<User[]>`
      UPDATE ${sql(TABLE_NAME)}
      SET ${sql(snakeCaseData)}
      WHERE user_id = ${userId}
      RETURNING *
    `;
    return result.length > 0 ? objectToCamelCaseKeys(result[0]) : null;
  },

  async deleteUser(userId: string): Promise<boolean> {
    const result = await sql`
      DELETE FROM ${sql(TABLE_NAME)}
      WHERE user_id = ${userId}
    `;
    return result.count > 0;
  },
};