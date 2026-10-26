import * as fs from 'fs';
import * as path from 'path';

function loadDotEnv(): void {
  const candidates = [
    path.join(process.cwd(), '.env'),
    path.join(process.cwd(), '../.env'),
    path.join(__dirname, '../../../.env'),
    path.join(__dirname, '../../../../.env'),
  ];

  for (const file of candidates) {
    if (fs.existsSync(file)) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        for (const line of content.split(/\r?\n/)) {
          const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
          if (match && !match[1].startsWith('#')) {
            const val = match[2].replace(/^(['"])(.*)\1$/, '$2').trim();
            if (!process.env[match[1]]) {
              process.env[match[1]] = val;
            }
          }
        }
      } catch {
        // Ignore read error
      }
    }
  }
}

loadDotEnv();

export const envConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 4000,
  databaseUrl:
    process.env.DATABASE_URL ||
    'postgresql://brewlite:brewlite_dev_password@localhost:5436/brewlite?schema=public',
  jwtSecret: process.env.JWT_SECRET || 'local-development-secret-change-me',
  webOrigin: process.env.WEB_ORIGIN || 'http://localhost:3000',
  productsCacheTtlMs: Number(process.env.PRODUCTS_CACHE_TTL_MS) || 30000,
};
