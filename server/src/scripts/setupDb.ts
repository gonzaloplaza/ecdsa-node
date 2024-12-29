import { insertAddress } from '@/db/walletsRepository';
import { createTable, getDbClient } from '@/db/client';
import { config } from '@/config';

const dbClient = getDbClient();

createTable(dbClient, config.tableName).then(async (): Promise<void> => {
  await insertAddress(dbClient)('0x1b7846169C00Ce5578c2CCf12c1FF3D9DEC6bE17', 0.0);
  await insertAddress(dbClient)('0x641cC50350023b40829BD753062F8a04bB09eee5', 0.0);

  console.log('Database entries created!');
  dbClient.close();
});
