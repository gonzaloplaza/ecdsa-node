import { insertAddress } from '@/db/walletsRepository';
import { Database } from 'sqlite3';
import { Address } from '@/valueObjects/address';

export const createAddress =
  (db: Database) =>
  async (address: Address): Promise<void> =>
    await insertAddress(db)(address, 0);
