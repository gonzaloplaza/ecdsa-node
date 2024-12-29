import { z } from 'zod';
import { addressSchema } from '@/valueObjects/address';

export const getBalanceRequestSchema = z.object({
  address: addressSchema,
});
