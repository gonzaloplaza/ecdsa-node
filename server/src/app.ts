import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { getDbClient } from '@/db/client';
import { Database } from 'sqlite3';
import { sendTransfer } from '@/services/sendTransfer';
import { getBalanceRequestSchema } from '@/schemas/getBalanceRequestSchema';
import { sendTransferRequestSchema } from '@/schemas/sendTransferRequestSchema';
import { createAddress } from '@/services/createAddress';
import { getWalletBalance } from '@/services/getWalletBalance';
import { createAddressRequestSchema } from '@/schemas/createAddressRequestSchema';
import { getAddressFromSignature } from '@/services/crypto';

export const getApp = async () => {
  const app: Express = express();
  const db: Database = getDbClient();
  app.use(cors());
  app.use(express.json());

  app.post('/address', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = createAddressRequestSchema.parse(req.body);
      await createAddress(db)(address);

      res.send({ address });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send({ error: JSON.parse(error.message) });
      }
    }

    return next();
  });

  app.get('/:address/balance', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { address } = getBalanceRequestSchema.parse(req.params);
      const balance = await getWalletBalance(db)(address);

      res.send({ balance });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send({ error: JSON.parse(error.message) });
      }
    }

    return next();
  });

  app.post('/send', async (req, res, next): Promise<void> => {
    const input = sendTransferRequestSchema.safeParse(req.body);
    if (!input.success) {
      res.status(400).send({ error: 'Invalid Input' });
      return next();
    }

    const { transaction, signature } = input.data;
    const { sender, recipient, amount } = transaction;

    try {
      const address = getAddressFromSignature(signature, JSON.stringify(transaction));
      if (address !== sender) {
        res.status(400).send({ error: `Invalid Address` });
        return next();
      }
    } catch (error) {
      res.status(400).send({ error: `Invalid Signature: ${error}` });
      return next();
    }

    try {
      const sendTransferResponse = await sendTransfer(db)(sender, recipient, amount);
      res.status(200).send({ success: true, balance: sendTransferResponse.updatedSenderBalance });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send({ error: error.message });
        return next();
      }
      res.status(400).send({ error: 'An error occurred' });
    }

    return next();
  });

  return app;
};
