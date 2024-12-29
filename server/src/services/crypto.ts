import { Address } from '@/valueObjects/address';
import { Signature } from '@/valueObjects/signature';
import { secp256k1 } from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { hexToBytes, toHex, utf8ToBytes } from 'ethereum-cryptography/utils';
import { encode, verify } from 'eip55';

const generateAddressFromPublicKey = (publicKey: Uint8Array): string => {
  const addressKeccak256 = keccak256(publicKey.slice(1)).slice(-20);
  const addressEip55 = encode('0x' + toHex(addressKeccak256));

  if (!verify(addressEip55)) {
    throw new Error('EIP55 address verification failed');
  }

  return addressEip55;
};

export const getAddressFromSignature = (signature: Signature, message: string): Address => {
  const signatureHex = signature.slice(0, 128);
  const recoveryBitHex = signature.slice(128);
  const recoveryBit = parseInt(recoveryBitHex, 16);
  const sig = secp256k1.Signature.fromCompact(signatureHex).addRecoveryBit(recoveryBit);
  const messageHash = keccak256(utf8ToBytes(message));
  const publicKey = sig.recoverPublicKey(toHex(messageHash)).toHex(false);
  const isVerified = secp256k1.verify(signatureHex, messageHash, publicKey);
  if (!isVerified) {
    throw new Error('Invalid Signature verification');
  }

  return generateAddressFromPublicKey(hexToBytes(publicKey));
};
