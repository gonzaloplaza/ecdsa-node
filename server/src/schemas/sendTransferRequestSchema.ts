import { z } from 'zod';
import { addressSchema } from '@/valueObjects/address';

export const sendTransferRequestSchema = z.object({
  transaction: z.object({
    sender: addressSchema,
    recipient: addressSchema,
    amount: z.number().positive(),
    nonce: z.number().positive(),
    timestamp: z.number().positive(),
  }),
  signature: z.string().length(129),
});
