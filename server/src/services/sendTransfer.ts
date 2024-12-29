import { Database } from 'sqlite3';
import { getAddressBalance, updateAddressBalance } from '@/db/walletsRepository';
import { Address } from '@/valueObjects/address';

type SendTransferResponse = {
  updatedSenderBalance: number;
};

export const sendTransfer =
  (dbClient: Database) =>
  async (sender: Address, recipient: Address, amount: number): Promise<SendTransferResponse> => {
    if (sender === recipient) {
      throw new Error('You cannot send money to yourself');
    }

    const senderBalance = await getAddressBalance(dbClient)(sender);
    if (senderBalance === null) {
      throw new Error('Invalid sender address');
    }

    if (senderBalance < amount) {
      throw new Error('Not enough founds');
    }
    const recipientBalance = await getAddressBalance(dbClient)(recipient);
    if (!recipientBalance) {
      throw new Error('Invalid recipient address');
    }

    // Update sender balance
    const updatedSenderBalance = senderBalance - amount;
    await updateAddressBalance(dbClient)(sender, updatedSenderBalance);

    // Update recipient balance
    const updatedRecipientBalance = recipientBalance + amount;
    await updateAddressBalance(dbClient)(recipient, updatedRecipientBalance);

    return { updatedSenderBalance };
  };
