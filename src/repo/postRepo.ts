import sql from "./conn.ts";
import type { Post } from "../models/entities.ts";
import { objectToSnakeCaseKeys } from "../utils/objectUtils.ts";

const TABLE_NAME = "posts";

export const postRepo = {
  async getPostById(postId: string): Promise<Post | null> {
    const result = await sql<Post[]>`
      SELECT * FROM ${sql(TABLE_NAME)}
      WHERE post_id = ${postId}
    `;
    return result.length > 0 ? result[0] : null;
  },

  async getPostsByUserId(authorId: string): Promise<Post[]> {
    const posts = await sql<Post[]>`
      SELECT * FROM ${sql(TABLE_NAME)}
      WHERE author_id = ${authorId}
      ORDER BY created_at DESC
    `;
    return posts;
  },

  async createPost(postData: Post): Promise<Post> {
    const snakeCaseData = objectToSnakeCaseKeys(postData);

    const result = await sql<Post[]>`
      INSERT INTO ${sql(TABLE_NAME)} ${sql(snakeCaseData)}
      RETURNING *
    `;
    if (result.length === 0) {
      throw new Error("Post creation failed, no record returned.");
    }
    return result[0];
  },

  async updatePost(postId: string, updateData: Post): Promise<Post | null> {
    if (Object.keys(updateData).length === 0) {
      return this.getPostById(postId);
    }

    const snakeCaseData = objectToSnakeCaseKeys(updateData);
    snakeCaseData.updated_at = new Date();

    const result = await sql<Post[]>`
      UPDATE ${sql(TABLE_NAME)}
      SET ${sql(snakeCaseData)}
      WHERE post_id = ${postId}
      RETURNING *
    `;
    return result.length > 0 ? result[0] : null;
  },

  async deletePost(postId: string): Promise<boolean> {
    const result = await sql`
      DELETE FROM ${sql(TABLE_NAME)}
      WHERE post_id = ${postId}
    `;
    return result.count > 0;
  },
};
