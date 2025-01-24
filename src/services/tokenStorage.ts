import { sql } from '@vercel/postgres';

// 简单的内存存储，在生产环境中你可能需要使用数据库或其他持久化存储
let accessToken: string | null = null;

export class TokenStorage {
  async getToken(serviceName: string): Promise<string | null> {
    try {
      const result = await sql`
        SELECT token
        FROM access_tokens
        WHERE service_name = ${serviceName}
        ORDER BY created_at DESC
        LIMIT 1
      `;
      return result.rows[0]?.token || null;
    } catch (error) {
      console.error(`[${serviceName}] Failed to get token:`, error);
      return null;
    }
  }

  async setToken(serviceName: string, token: string): Promise<void> {
    try {
      await sql`
        INSERT INTO access_tokens (service_name, token)
        VALUES (${serviceName}, ${token})
        ON CONFLICT (service_name) DO UPDATE SET
          token = EXCLUDED.token,
          updated_at = CURRENT_TIMESTAMP
      `;
      console.log(`[${serviceName}] Token saved successfully`);
    } catch (error) {
      console.error(`[${serviceName}] Failed to save token:`, error);
      throw error;
    }
  }

  async clearToken(serviceName: string): Promise<void> {
    try {
      await sql`
        DELETE FROM access_tokens
        WHERE service_name = ${serviceName}
      `;
      console.log(`[${serviceName}] Token cleared successfully`);
    } catch (error) {
      console.error(`[${serviceName}] Failed to clear token:`, error);
      throw error;
    }
  }
}

export const tokenStorage = new TokenStorage(); 