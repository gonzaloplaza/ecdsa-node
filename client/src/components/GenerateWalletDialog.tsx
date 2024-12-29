import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCallback, useEffect, useState } from "react";
import { Download, RefreshCcw } from "lucide-react";
import { generateRandomKeys } from "@/lib/crypto";
import { AxiosError } from "axios";
import api from "@/api";
import { saveAs } from "file-saver";
import { Link } from "react-router-dom";

type GenerateWalletDialogProps = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

export const GenerateWalletDialog = ({ isOpen, setOpen }: GenerateWalletDialogProps) => {
  const [privateKey, setPrivateKey] = useState<string>("");
  const [publicKey, setPublicKey] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const saveAndDownloadKeys = async () => {
    try {
      const file = new Blob(
        [
          `Private Key: ${privateKey}\n`,
          `Public Key: ${publicKey}\n`,
          `Address (EIP-55): ${address}\n`,
        ],
        { type: "text/plain;charset=utf-8" }
      );
      saveAs(file, `${address}.txt`);

      await api.post(`address`, {
        address,
      });
      setOpen(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        alert(error.response?.data.error);
      } else {
        alert("An error occurred while saving the keys. Please try again.");
      }
    }
  };

  const generateKeys = useCallback(() => {
    const { privateKey, publicKey, address } = generateRandomKeys();
    setPrivateKey(privateKey);
    setPublicKey(publicKey);
    setAddress(address);
  }, []);

  useEffect(() => {
    if (isOpen) {
      generateKeys();
    }
  }, [generateKeys, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[700px]"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Generate Wallet Address Keys</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Please <b>DO NOT SHARE</b> your private key with anyone. Keep it safe and secure. Export
          and store these keys in a safe place. The following keys have been generated locally.
        </DialogDescription>
        <div className="grid grid-cols-1 gap-4 py-4 justify-start">
          <div className="grid grid-cols-5 items-center">
            <Label htmlFor="privateKey" className="text-left">
              Private Key
            </Label>
            <Input id="privateKey" className="col-span-4 bg-input" value={privateKey} readOnly />
          </div>
          <div className="grid grid-cols-5 items-center">
            <Label htmlFor="publicKey" className="text-left">
              Public Key
            </Label>
            <Input id="publicKey" className="col-span-4 bg-input" value={publicKey} readOnly />
          </div>
          <div className="grid grid-cols-5 items-center">
            <Label htmlFor="address" className="text-left">
              Address (EIP-55)
            </Label>
            <Input id="address" className="col-span-4 bg-accent" value={address} readOnly />
          </div>

          <div className="grid grid-cols-5 items-center">
            <Label htmlFor="address-link" className="text-left">
              Ether Scan
            </Label>
            <Link
              className="col-span-4 text-sm text-muted-foreground underline"
              to={`https://etherscan.io/address/${address}`}
              target="_blank"
            >
              Open in https://etherscan.io
            </Link>
          </div>
        </div>
        <Separator />
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => generateKeys()}>
            Regenerate Keys <RefreshCcw className="w-4 h-4" />
          </Button>
          <Button type="submit" variant="default" onClick={() => saveAndDownloadKeys()}>
            Save Keys <Download className="w-4 h-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
