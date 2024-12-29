import { Button } from "@/components/ui/button";
import { MoveRight, Wallet as WalletIcon } from "lucide-react";
import { useState } from "react";
import { GenerateWalletDialog } from "@/components/GenerateWalletDialog.tsx";
import { SendTransactionDialog } from "@/components/SendTransactionDialog.tsx";

const Home = () => {
  const [openGenerateWalletDialog, setOpenGenerateWalletDialog] = useState(false);
  const [openSendTransactionDialog, setSendTransactionDialog] = useState(false);
  return (
    <div className="flex items-center justify-center p-6 md:p-10">
      <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
        <div className="flex gap-4 flex-col">
          <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
            ECDSA Node
          </h1>
          <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
            This project is an example of using a client and a centralized server to facilitate
            transfers between different EIP55 addresses using Elliptic Curve Digital Signatures.
          </p>
        </div>
        <div className="flex flex-row gap-3">
          <Button
            size="lg"
            className="gap-4"
            variant="outline"
            onClick={() => setOpenGenerateWalletDialog(true)}
          >
            Create Wallet <WalletIcon className="w-4 h-4" />
          </Button>
          <Button size="lg" className="gap-4" onClick={() => setSendTransactionDialog(true)}>
            Send Transaction <MoveRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      <GenerateWalletDialog
        isOpen={openGenerateWalletDialog}
        setOpen={setOpenGenerateWalletDialog}
      />
      <SendTransactionDialog
        isOpen={openSendTransactionDialog}
        setOpen={setSendTransactionDialog}
      />
    </div>
  );
};

export default Home;
