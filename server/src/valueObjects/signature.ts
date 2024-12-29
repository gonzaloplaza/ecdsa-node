import { z } from 'zod';

export const signatureSchema = z.string().min(129).max(129);

export type Signature = z.infer<typeof signatureSchema>;
