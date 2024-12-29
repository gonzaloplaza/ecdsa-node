import { z } from "zod";
import { addressSchema } from "@/entities/address";

export const transactionSchema = z
  .object({
    sender: addressSchema,
    recipient: addressSchema,
    amount: z.number().positive(),
    nonce: z.number().positive(),
    timestamp: z.number().positive(),
  })
  .refine((data) => data.sender !== data.recipient, {
    message: "Recipient address must be different from sender address",
    path: ["recipient"],
  });

export type Transaction = z.infer<typeof transactionSchema>;
