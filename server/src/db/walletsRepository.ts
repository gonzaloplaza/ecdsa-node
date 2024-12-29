import { Database } from 'sqlite3';
import { Wallet } from '@/entities/wallet';
import { execute, fetchFirst } from '@/db/client';
import { config } from '@/config';

const tableName = config.tableName;

export const insertAddress = (db: Database) => async (address: string, balance: number) => {
  const sql = `INSERT INTO ${tableName} (address, balance) VALUES(?, ?)`;
  await execute(db, sql, [address, balance]);
};

export const getAddressBalance =
  (db: Database) =>
  async (address: string): Promise<number | null> => {
    const sql = `SELECT balance FROM ${tableName} WHERE address = ?`;
    const result = await fetchFirst<Pick<Wallet, 'balance'>>(db, sql, [address]);

    return result !== undefined ? result.balance : null;
  };

export const updateAddressBalance = (db: Database) => async (address: string, balance: number) => {
  const sql = `UPDATE ${tableName} SET balance=? WHERE address=?`;
  await execute(db, sql, [balance, address]);

  return { address, balance };
};
