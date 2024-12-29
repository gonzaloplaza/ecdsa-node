import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useEffect } from "react";
import { SendHorizonal } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  generateAddressFromPublicKey,
  generatePublicKeyFromPrivateKey,
  signMessage,
  verifyAddress,
} from "@/lib/crypto";
import { addressSchema } from "@/entities/address";
import { Transaction, transactionSchema } from "@/entities/transaction";
import { toast } from "sonner";
import { AxiosError } from "axios";
import api from "@/api";

type SendTransactionDialogProps = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

const sendTransactionFormSchema = z.object({
  privateKey: z.string().regex(/^[a-fA-F0-9]+$/, "Invalid Private Key format"),
  toAddress: addressSchema,
  amount: z.coerce.number().positive(),
});

export const SendTransactionDialog = ({ isOpen, setOpen }: SendTransactionDialogProps) => {
  const sendTransactionForm = useForm<z.infer<typeof sendTransactionFormSchema>>({
    resolver: zodResolver(sendTransactionFormSchema),
    defaultValues: {
      privateKey: "",
      toAddress: "",
      amount: 0,
    },
  });

  useEffect(() => {
    if (isOpen) {
      sendTransactionForm.reset();
    }
  }, [isOpen, sendTransactionForm]);

  const sendTransaction = async (transaction: Transaction, signature: string) => {
    try {
      await api.post(`send`, { transaction, signature });
      toast.success("", {
        className:
          "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
        description: JSON.stringify(transaction, null, 1),
        duration: 6000,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error("Ops! An error has occurred", {
          description: error.response?.data.error,
          duration: 6000,
        });
      } else {
        toast.error("Ops! An error has occurred", {
          description: "An error occurred while sending the transaction. Please try again.",
          duration: 6000,
        });
      }
      return;
    }
  };

  const onSubmit = async (values: z.infer<typeof sendTransactionFormSchema>) => {
    const publicKey = generatePublicKeyFromPrivateKey(values.privateKey);
    const senderAddress = generateAddressFromPublicKey(publicKey);

    const transaction = transactionSchema.safeParse({
      sender: senderAddress,
      recipient: values.toAddress,
      amount: values.amount,
      nonce: crypto.getRandomValues(new Uint32Array(1))[0],
      timestamp: Date.now(),
    });

    if (!transaction.success) {
      console.log(transaction.error);
      toast.error("Ops! Invalid transaction", {
        description: transaction.error.errors[0].message,
        duration: 6000,
      });
      return;
    }

    if (!verifyAddress(transaction.data.sender) || !verifyAddress(transaction.data.recipient)) {
      toast.error("Ops! An error has occurred", {
        description: "Invalid address verification",
        duration: 6000,
      });
      return;
    }

    const signature = signMessage(JSON.stringify(transaction.data), values.privateKey);
    await sendTransaction(transaction.data, signature);

    //setOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[700px]"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Send Transaction</DialogTitle>
        </DialogHeader>
        <Separator />
        <DialogDescription>
          Please <b>DO NOT SHARE</b> your private key with anyone. Keep it safe and secure. Export
          and store these keys in a safe place. The following keys have been generated locally.
        </DialogDescription>
        <Form {...sendTransactionForm}>
          <form onSubmit={sendTransactionForm.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={sendTransactionForm.control}
                name="privateKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Private Key</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-input"
                        placeholder="Paste your wallet private key"
                        type="password"
                        autoFocus
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>This key is needed to sign the transaction.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-5 gap-4 py-4">
              <FormField
                control={sendTransactionForm.control}
                name="toAddress"
                render={({ field }) => (
                  <FormItem className="col-span-3">
                    <FormLabel>Destination Address</FormLabel>
                    <FormControl>
                      <Input
                        className="bg-input"
                        placeholder="Type a valid destination address (0x....)"
                        required
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={sendTransactionForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input className="bg-input" type="number" step="any" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  sendTransactionForm.reset();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" variant="default">
                Sign and Send <SendHorizonal className="w-4 h-4" />
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
