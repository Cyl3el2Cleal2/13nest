import { Injectable } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { EncryptDto, EncryptResponseDto, DecryptDto } from './app.dto';

@Injectable()
export class AppService {
  constructor(private cryptoService: CryptoService) {}

  getHello(): string {
    return 'Hello World!';
  }

  encrypt(payload: any): EncryptResponseDto {
    return this.cryptoService.encryptPayload(payload);
  }

  decrypt(data1: string, data2: string): any {
    return this.cryptoService.decryptPayload(data1, data2);
  }
}
