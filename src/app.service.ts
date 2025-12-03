import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  encrypt(data: string) {

  }

  decrypt(data1: string, data2: string) {

  }
}
