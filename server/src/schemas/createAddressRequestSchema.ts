import { z } from 'zod';
import { addressSchema } from '@/valueObjects/address';

export const createAddressRequestSchema = z.object({
  address: addressSchema,
});
