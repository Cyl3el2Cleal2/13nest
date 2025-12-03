import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { DecryptDto, DecryptResponseDto, EncryptDto, EncryptResponseDto } from './app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/get-encrypt-data')
  encryptData(@Body() body: EncryptDto): EncryptResponseDto {
    return this.appService.encrypt(body.payload);
  }

  @Post('/get-decrypt-data')
  decryptData(@Body() body: DecryptDto): DecryptResponseDto {
    return this.appService.decrypt(body.data1, body.data2);
  }
}
