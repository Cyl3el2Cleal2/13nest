import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { DecryptDto, GetEncryptDto } from './app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Post('/get-encrypt-data')
  encryptData(@Body() body: GetEncryptDto) {
    
  }


  @Post('/get-decrypt-data')
  decryptData(@Body() body: DecryptDto) {
     
  }
}
