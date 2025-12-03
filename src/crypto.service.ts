import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CryptoService {
  private readonly privateKey: string;
  private readonly publicKey: string;

  constructor(private configService: ConfigService) {
    const privateKey = this.configService.get<string>('keys.private');
    const publicKey = this.configService.get<string>('keys.public');

    if (!privateKey) {
      throw new Error('Private key not found in configuration');
    }
    if (!publicKey) {
      throw new Error('Public key not found in configuration');
    }

    this.privateKey = privateKey;
    this.publicKey = publicKey;
  }

  /**
   * Generate a random string and convert it to AES key
   */
  generateAESKey(): string {
    const randomString = crypto.randomBytes(32).toString('hex');
    return randomString;
  }

  /**
   * Encrypt data using AES-256-CBC with fixed IV
   */
  encryptWithAES(data: string, key: string): string {
    const iv = Buffer.alloc(16, 0); // Fixed IV of zeros
    const cipher = crypto.createCipheriv(
      'aes-256-cbc',
      Buffer.from(key, 'hex'),
      iv,
    );
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  /**
   * Decrypt data using AES-256-CBC with fixed IV
   */
  decryptWithAES(encryptedData: string, key: string): string {
    const iv = Buffer.alloc(16, 0); // Fixed IV of zeros
    const decipher = crypto.createDecipheriv(
      'aes-256-cbc',
      Buffer.from(key, 'hex'),
      iv,
    );
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  encryptAESKeyWithPrivate(aesKey: string): string {
    // Convert string to Buffer
    const buffer = Buffer.from(aesKey, 'utf8');

    // "Encrypt" with Private Key (technically Signing)
    const encrypted = crypto.privateEncrypt(
      {
        key: this.privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING, // Required for this operation
      },
      buffer,
    );

    return encrypted.toString('base64');
  }

  decryptAESKeyWithPublic(encryptedBase64: string): string {
    const buffer = Buffer.from(encryptedBase64, 'base64');

    // Decrypt with Public Key
    const decrypted = crypto.publicDecrypt(
      {
        key: this.publicKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      buffer,
    );

    return decrypted.toString('utf8');
  }

  /**
   * Main encryption function that returns the required format
   */
  encryptPayload(payload: any): { data1: string; data2: string } {
    // Generate AES key from random string
    const aesKey = this.generateAESKey();

    // Encrypt payload with AES key
    const payloadString = JSON.stringify(payload);
    const encryptedPayload = this.encryptWithAES(payloadString, aesKey);

    // Encrypt AES key with RSA public key
    const encryptedAESKey = this.encryptAESKeyWithPrivate(aesKey);

    return {
      data1: encryptedAESKey,
      data2: encryptedPayload,
    };
  }

  /**
   * Main decryption function
   */
  decryptPayload(data1: string, data2: string): any {
    // Step 1: Get AES key by decrypting data1 with RSA private key
    const aesKey = this.decryptAESKeyWithPublic(data1);

    // Step 2: Decrypt payload with AES key
    const decryptedPayload = this.decryptWithAES(data2, aesKey);

    return JSON.parse(decryptedPayload);
  }
}
