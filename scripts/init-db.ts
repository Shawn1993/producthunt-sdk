import { sql } from '@vercel/postgres';
import fs from 'fs';
import path from 'path';

async function initDatabase() {
  try {
    console.log('开始初始化数据库...');

    // 读取 schema.sql 文件
    const schemaPath = path.join(process.cwd(), 'src', 'db', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // 创建 ltree 扩展
    await sql`CREATE EXTENSION IF NOT EXISTS ltree;`;
    console.log('创建 ltree 扩展成功');

    // 执行 schema.sql
    await sql.query(schema);
    console.log('创建数据库表成功');

    console.log('数据库初始化完成！');
  } catch (error) {
    console.error('初始化数据库失败:', error);
    process.exit(1);
  }
}

// 运行初始化脚本
initDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('脚本执行失败:', error);
    process.exit(1);
  }); 