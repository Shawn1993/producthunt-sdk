import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

interface Config {
  api: {
    productHunt: {
      baseUrl: string;
      graphqlUrl: string;
      oauthUrl: string;
      tokenUrl: string;
      serviceName: string;
      redirectUri: string;
      scopes: string[];
    };
  };
  database: {
    tableName: string;
  };
}

const loadConfig = (): Config => {
  try {
    const configPath = path.join(process.cwd(), 'src/config/config.yaml');
    const fileContents = fs.readFileSync(configPath, 'utf8');
    return yaml.load(fileContents) as Config;
  } catch (error) {
    console.error('加载配置文件失败:', error);
    throw error;
  }
};

const config = loadConfig();

export default config; 