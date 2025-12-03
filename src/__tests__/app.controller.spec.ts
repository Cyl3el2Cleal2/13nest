import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { CryptoService } from '../crypto.service';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';

describe('AppController', () => {
  let controller: AppController;
  let appService: AppService;

  const mockAppService = {
    getHello: jest.fn(),
    encrypt: jest.fn(),
    decrypt: jest.fn(),
  };

  const mockCryptoService = {
    encryptPayload: jest.fn(),
    decryptPayload: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
        {
          provide: CryptoService,
          useValue: mockCryptoService,
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getHello', () => {
    it('should return hello message', () => {
      mockAppService.getHello.mockReturnValue('Hello World!');
      expect(controller.getHello()).toBe('Hello World!');
    });
  });

  describe('encryptData', () => {
    const mockPayload = 'Hello, World!';
    const mockBody = { payload: mockPayload };
    const mockSuccessResponse = {
      data: { data1: 'encrypted-key', data2: 'encrypted-data' },
      error_code: '',
      successful: true,
    };
    const mockErrorResponse = {
      data: null,
      error_code: 'ENCRYPTION_ERROR',
      successful: false,
    };

    it('should return successful encryption response', () => {
      mockAppService.encrypt.mockReturnValue(mockSuccessResponse);

      const result = controller.encryptData(mockBody);

      expect(result).toEqual(mockSuccessResponse);
      expect(appService.encrypt).toHaveBeenCalledWith(mockPayload);
    });

    it('should throw BadRequestException when payload is missing', () => {
      const invalidBody = { payload: null };

      expect(() => controller.encryptData(invalidBody)).toThrow(
        BadRequestException,
      );
      expect(() => controller.encryptData(invalidBody)).toThrow(
        'Payload is required',
      );
    });

    it('should throw BadRequestException when payload is undefined', () => {
      const invalidBody = {};

      expect(() => controller.encryptData(invalidBody)).toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException when service returns unsuccessful response', () => {
      mockAppService.encrypt.mockReturnValue(mockErrorResponse);

      expect(() => controller.encryptData(mockBody)).toThrow(
        InternalServerErrorException,
      );
      expect(() => controller.encryptData(mockBody)).toThrow(
        'Encryption operation failed',
      );
    });

    it('should rethrow BadRequestException from service validation', () => {
      mockAppService.encrypt.mockImplementation(() => {
        throw new BadRequestException('Invalid payload format');
      });

      expect(() => controller.encryptData(mockBody)).toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException for unexpected errors', () => {
      mockAppService.encrypt.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      expect(() => controller.encryptData(mockBody)).toThrow(
        InternalServerErrorException,
      );
      expect(() => controller.encryptData(mockBody)).toThrow(
        'Encryption failed',
      );
    });
  });

  describe('decryptData', () => {
    const mockBody = {
      data1: 'encrypted-key-data',
      data2: 'encrypted-payload-data',
    };
    const mockSuccessResponse = {
      data: { payload: { message: 'decrypted data' } },
      error_code: '',
      successful: true,
    };
    const mockErrorResponse = {
      data: null,
      error_code: 'DECRYPTION_ERROR',
      successful: false,
    };

    it('should return successful decryption response', () => {
      mockAppService.decrypt.mockReturnValue(mockSuccessResponse);

      const result = controller.decryptData(mockBody);

      expect(result).toEqual(mockSuccessResponse);
      expect(appService.decrypt).toHaveBeenCalledWith(
        mockBody.data1,
        mockBody.data2,
      );
    });

    it('should throw BadRequestException when data1 is missing', () => {
      const invalidBody = { data1: '', data2: 'some-data' };

      expect(() => controller.decryptData(invalidBody)).toThrow(
        BadRequestException,
      );
      expect(() => controller.decryptData(invalidBody)).toThrow(
        'Both data1 and data2 are required',
      );
    });

    it('should throw BadRequestException when data2 is missing', () => {
      const invalidBody = { data1: 'some-data', data2: '' };

      expect(() => controller.decryptData(invalidBody)).toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when both data1 and data2 are missing', () => {
      const invalidBody = { data1: '', data2: '' };

      expect(() => controller.decryptData(invalidBody)).toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when data1 is undefined', () => {
      const invalidBody = { data2: 'some-data' };

      expect(() => controller.decryptData(invalidBody)).toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException when data2 is undefined', () => {
      const invalidBody = { data1: 'some-data' };

      expect(() => controller.decryptData(invalidBody)).toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException when service returns unsuccessful response', () => {
      mockAppService.decrypt.mockReturnValue(mockErrorResponse);

      expect(() => controller.decryptData(mockBody)).toThrow(
        InternalServerErrorException,
      );
      expect(() => controller.decryptData(mockBody)).toThrow(
        'Decryption operation failed',
      );
    });

    it('should rethrow BadRequestException from service validation', () => {
      mockAppService.decrypt.mockImplementation(() => {
        throw new BadRequestException('Invalid decryption data');
      });

      expect(() => controller.decryptData(mockBody)).toThrow(
        BadRequestException,
      );
    });

    it('should throw InternalServerErrorException for unexpected errors', () => {
      mockAppService.decrypt.mockImplementation(() => {
        throw new Error('Unexpected decryption error');
      });

      expect(() => controller.decryptData(mockBody)).toThrow(
        InternalServerErrorException,
      );
      expect(() => controller.decryptData(mockBody)).toThrow(
        'Decryption failed',
      );
    });
  });
});
