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
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@Controller()
@ApiTags('API')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/get-encrypt-data')
  @ApiOperation({
    summary: 'Encrypt Data',
    description:
      'Encrypts a string payload using hybrid RSA+AES encryption. The payload is first encrypted with AES-256-CBC, then the AES key is encrypted with RSA private key.',
  })
  @ApiBody({
    type: EncryptDto,
    description: 'The string data to be encrypted (max 2000 characters)',
    examples: {
      'Simple text': {
        value: { payload: 'Hello, World!' },
      },
      'JSON string': {
        value: { payload: '{"message":"test","data":[1,2,3]}' },
      },
      'Long text': {
        value: {
          payload:
            'This is a longer string that demonstrates encryption capabilities with RSA+AES hybrid encryption...',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Encryption successful',
    type: EncryptResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input',
    schema: {
      type: 'object',
      properties: {
        successful: { type: 'boolean', example: false },
        error_code: { type: 'string', example: 'VALIDATION_ERROR' },
        data: { type: 'null', example: null },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Encryption failed',
    schema: {
      type: 'object',
      properties: {
        successful: { type: 'boolean', example: false },
        error_code: { type: 'string', example: 'ENCRYPTION_ERROR' },
        data: { type: 'null', example: null },
      },
    },
  })
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
  @ApiOperation({
    summary: 'Decrypt Data',
    description:
      'Decrypts data that was encrypted using the encrypt endpoint. Uses RSA public key to decrypt the AES key, then AES to decrypt the payload.',
  })
  @ApiBody({
    type: DecryptDto,
    description: 'The encrypted data to be decrypted',
    examples: {
      'Valid encrypted data': {
        value: {
          data1:
            'UthI1NJoPg81rkvYCRWLnFRgzvgSlkesfJUDYjuDfVxb3YGBZFgxiYCNn7p1ZyTwVonK0Q3xn0eAB2Knqt543ep08ujrGlkNQdHyHiFZVA4BOfB79oJZWTE9BawOMJg1F1wfSKUmYXSya8ScQBnVYBxxORFbM9YzZwoMq/Brtqrt/3Vp1culWo59cygW+6iR9egg4ygtAMb7JsCfECP9ueG229lGJCkrl8HFhOxhsRQeT/k/hvkww6RhenwjKRu2xJT7UaUPPHf9zwIUeUPjeOSQ5NMClotCMLJeq9mVHmdSptWAUQhj7KqmbFpf3s2HONT/fKXnJ9eRJUQIyzEx4g==',
          data2: '9b4af15ccd3bc2581c8b54d1661662a6',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Decryption successful',
    schema: {
      type: 'object',
      properties: {
        successful: { type: 'boolean', example: true },
        error_code: { type: 'string', example: '' },
        data: {
          type: 'object',
          properties: {
            payload: { type: 'string', example: 'Hello, World!' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input',
    schema: {
      type: 'object',
      properties: {
        successful: { type: 'boolean', example: false },
        error_code: { type: 'string', example: 'VALIDATION_ERROR' },
        data: { type: 'null', example: null },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error - Decryption failed',
    schema: {
      type: 'object',
      properties: {
        successful: { type: 'boolean', example: false },
        error_code: { type: 'string', example: 'DECRYPTION_ERROR' },
        data: { type: 'null', example: null },
      },
    },
  })
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
