import { sql } from '@vercel/postgres';

// 简单的内存存储，在生产环境中你可能需要使用数据库或其他持久化存储
let accessToken: string | null = null;

export const tokenStorage = {
  setToken: async (serviceName: string, token: string) => {
    try {
      // 使用 upsert 来更新或插入令牌
      await sql`
        INSERT INTO access_tokens (service_name, token)
        VALUES (${serviceName}, ${token})
        ON CONFLICT (service_name)
        DO UPDATE SET 
          token = EXCLUDED.token,
          updated_at = CURRENT_TIMESTAMP
      `;
      console.log(`${serviceName} 的访问令牌已保存到数据库`);
    } catch (error) {
      console.error(`保存 ${serviceName} 的令牌失败:`, error);
      throw error;
    }
  },
  
  getToken: async (serviceName: string): Promise<string | null> => {
    try {
      const result = await sql`
        SELECT token
        FROM access_tokens
        WHERE service_name = ${serviceName}
        LIMIT 1
      `;
      
      return result.rows[0]?.token || null;
    } catch (error) {
      console.error(`获取 ${serviceName} 的令牌失败:`, error);
      return null;
    }
  },
  
  clearToken: async (serviceName: string) => {
    try {
      await sql`
        DELETE FROM access_tokens
        WHERE service_name = ${serviceName}
      `;
      console.log(`${serviceName} 的访问令牌已从数据库清除`);
    } catch (error) {
      console.error(`清除 ${serviceName} 的令牌失败:`, error);
      throw error;
    }
  },

  // 可选：清除所有令牌
  clearAllTokens: async () => {
    try {
      await sql`DELETE FROM access_tokens`;
      console.log('所有访问令牌已从数据库清除');
    } catch (error) {
      console.error('清除所有令牌失败:', error);
      throw error;
    }
  }
}; 