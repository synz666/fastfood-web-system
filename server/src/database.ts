import dotenv from 'dotenv';
import sql from 'mssql/msnodesqlv8';
import { logger } from './utils/logger';

dotenv.config();

const useTrusted = String(process.env.DB_TRUSTED_CONNECTION).toLowerCase() === 'true';
const rawServer = process.env.DB_SERVER || 'DESKTOP-RTKNA5I\\SQLEXPRESS';
const dbName = process.env.DB_DATABASE || 'ShvydkoFoodDb';

const [serverName, instanceName] = rawServer.split('\\');

let config: any;

if (useTrusted) {
  const connectionString = `Driver={ODBC Driver 18 for SQL Server};Server=${rawServer};Database=${dbName};Trusted_Connection=Yes;TrustServerCertificate=Yes;Encrypt=No;`;

  config = {
    driver: 'msnodesqlv8',
    connectionString,
  };

  logger.debug('SQL config:', {
    server: serverName,
    database: dbName,
    driver: 'msnodesqlv8',
    instanceName: instanceName || 'SQLEXPRESS',
  });
} else {
  config = {
    server: serverName,
    database: dbName,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    options: {
      encrypt: false,
      trustServerCertificate: true,
      instanceName: instanceName || 'SQLEXPRESS',
    },
  };

  logger.debug('SQL config:', {
    server: serverName,
    database: dbName,
    driver: 'msnodesqlv8',
    instanceName: instanceName || 'SQLEXPRESS',
  });
}

export const pool = new sql.ConnectionPool(config);
export const poolConnect = pool.connect();

pool.on('error', (error: unknown) => {
  logger.error('SQL pool error:', error instanceof Error ? error.message : String(error));
});

export { sql };
