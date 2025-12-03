import {
  Body,
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { AppService } from './app.service';
import {
  DecryptDto,
  DecryptResponseDto,
  EncryptDto,
  EncryptResponseDto,
} from './app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/get-encrypt-data')
  @HttpCode(HttpStatus.OK)
  encryptData(@Body() body: EncryptDto): EncryptResponseDto {
    try {
      if (!body.payload) {
        throw new BadRequestException('Payload is required');
      }
      const result = this.appService.encrypt(body.payload);
      if (!result.successful) {
        throw new InternalServerErrorException('Encryption operation failed');
      }
      return result;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Encryption failed');
    }
  }

  @Post('/get-decrypt-data')
  @HttpCode(HttpStatus.OK)
  decryptData(@Body() body: DecryptDto): DecryptResponseDto {
    try {
      if (!body.data1 || !body.data2) {
        throw new BadRequestException('Both data1 and data2 are required');
      }
      const result = this.appService.decrypt(body.data1, body.data2);
      if (!result.successful) {
        throw new InternalServerErrorException('Decryption operation failed');
      }
      return result;
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Decryption failed');
    }
  }
}
