import { z } from 'zod';

export const addressSchema = z.string().startsWith('0x').length(42);

export type Address = z.infer<typeof addressSchema>;
