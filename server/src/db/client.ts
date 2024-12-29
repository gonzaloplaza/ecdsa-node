import sqlite, { Database } from 'sqlite3';
import { resolve } from 'node:path';

import { config } from '@/config';

// Wrappers
type SqlParam = string | number | boolean;

export const getDbClient = () => new sqlite.Database(resolve(__dirname, config.dbName));

export const execute = async (dbClient: Database, sql: string, params: SqlParam[] = []) => {
  if (params && params.length > 0) {
    return new Promise((resolve, reject) => {
      dbClient.run(sql, params, (err) => {
        if (err) reject(err);
        resolve(null);
      });
    });
  }
  return new Promise((resolve, reject) => {
    dbClient.exec(sql, (err) => {
      if (err) reject(err);
      resolve(null);
    });
  });
};

export const fetchFirst = async <T>(
  dbClient: Database,
  sql: string,
  params: SqlParam[]
): Promise<T | undefined> => {
  return new Promise((resolve, reject) => {
    dbClient.get(sql, params, (err, row) => {
      if (err) reject(err);
      resolve(row as T);
    });
  });
};

export const createTable = async (dbClient: Database, tableName: string) => {
  try {
    await execute(
      dbClient,
      `CREATE TABLE IF NOT EXISTS ${tableName} (
          id INTEGER PRIMARY KEY,
          address TEXT NOT NULL UNIQUE,
          balance DECIMAL(10, 2) NOT NULL DEFAULT 0.0
      )`
    );
  } catch (error) {
    console.log(error);
  }
};
