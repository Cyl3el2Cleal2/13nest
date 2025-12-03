import { Injectable } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { EncryptDto, EncryptResponseDto, DecryptDto, DecryptResponseDto } from './app.dto';

@Injectable()
export class AppService {
  constructor(private cryptoService: CryptoService) {}

  getHello(): string {
    return 'Hello World!';
  }

  encrypt(payload: any): EncryptResponseDto {
    const data = this.cryptoService.encryptPayload(payload);
    return {
      data,
      error_code: "",
      successful: true
    }
  }

  decrypt(data1: string, data2: string): DecryptResponseDto {
    const data = this.cryptoService.decryptPayload(data1, data2);
    return {
      data,
      error_code: "",
      successful: true
    }
  }
}
