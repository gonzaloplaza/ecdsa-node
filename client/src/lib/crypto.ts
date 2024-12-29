import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";
import { encode, verify } from "eip55";

/**
 * -----> DISCLAIMER: DO NOT SHARE PRIVATE KEYS ON THE INTERNET OR OFFLINE <-----
 * -----> USE THIS SCRIPT UNDER YOUR OWN RESPONSIBILITY <-----
 */
// Reference: https://eips.ethereum.org/EIPS/eip-55
const generatePrivateKey = (): Uint8Array => secp256k1.utils.randomPrivateKey();

export const generatePublicKeyFromPrivateKey = (privateKey: Uint8Array | string): Uint8Array =>
  secp256k1.getPublicKey(privateKey, false);

export const generateAddressFromPublicKey = (publicKey: Uint8Array): string => {
  const addressKeccak256 = keccak256(publicKey.slice(1)).slice(-20);
  const addressEip55 = encode("0x" + toHex(addressKeccak256));

  if (!verify(addressEip55)) {
    throw new Error("EIP55 address verification failed");
  }

  return addressEip55;
};

export const generateRandomKeys = () => {
  const privateKey = generatePrivateKey();
  const publicKey = generatePublicKeyFromPrivateKey(privateKey);
  const address = generateAddressFromPublicKey(publicKey);

  return { privateKey: toHex(privateKey), publicKey: toHex(publicKey), address };
};

export const verifyAddress = (address: string): boolean => verify(address);

export const signMessage = (message: string, privateKey: Uint8Array | string): string => {
  const messageHash = keccak256(utf8ToBytes(message));
  const signature = secp256k1.sign(toHex(messageHash), privateKey);

  return `${signature.toCompactHex()}${signature.recovery.toString(16)}`;
};
