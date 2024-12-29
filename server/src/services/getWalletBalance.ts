import { getAddressBalance } from '@/db/walletsRepository';
import { Database } from 'sqlite3';
import { Address } from '@/valueObjects/address';

export const getWalletBalance =
  (db: Database) =>
  async (address: Address): Promise<number> => {
    let balance = await getAddressBalance(db)(address);

    if (!balance) {
      balance = 0;
    }

    return balance;
  };
