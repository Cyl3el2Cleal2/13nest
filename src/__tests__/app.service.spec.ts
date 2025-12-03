import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '../app.service';
import { CryptoService } from '../crypto.service';

describe('AppService', () => {
  let service: AppService;
  let cryptoService: CryptoService;

  const mockCryptoService = {
    encryptPayload: jest.fn(),
    decryptPayload: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: CryptoService,
          useValue: mockCryptoService,
        },
      ],
    }).compile();

    service = module.get<AppService>(AppService);
    cryptoService = module.get<CryptoService>(CryptoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getHello', () => {
    it('should return hello message', () => {
      expect(service.getHello()).toBe('Hello World!');
    });
  });

  describe('encrypt', () => {
    const mockPayload = { message: 'test data' };
    const mockEncryptedData = {
      data1: 'encrypted-aes-key',
      data2: 'encrypted-payload',
    };

    it('should return successful encryption response', () => {
      mockCryptoService.encryptPayload.mockReturnValue(mockEncryptedData);

      const result = service.encrypt(mockPayload);

      expect(result).toEqual({
        data: mockEncryptedData,
        error_code: '',
        successful: true,
      });
      expect(cryptoService.encryptPayload).toHaveBeenCalledWith(mockPayload);
    });

    it('should handle encryption errors gracefully', () => {
      mockCryptoService.encryptPayload.mockImplementation(() => {
        throw new Error('Encryption failed');
      });

      const result = service.encrypt(mockPayload);

      expect(result).toEqual({
        data: null,
        error_code: 'ENCRYPTION_ERROR',
        successful: false,
      });
    });
  });

  describe('decrypt', () => {
    const mockData1 = 'encrypted-aes-key';
    const mockData2 = 'encrypted-payload';
    const mockDecryptedData = { message: 'decrypted data' };

    it('should return successful decryption response', () => {
      mockCryptoService.decryptPayload.mockReturnValue(mockDecryptedData);

      const result = service.decrypt(mockData1, mockData2);

      expect(result).toEqual({
        data: { payload: mockDecryptedData },
        error_code: '',
        successful: true,
      });
      expect(cryptoService.decryptPayload).toHaveBeenCalledWith(
        mockData1,
        mockData2,
      );
    });

    it('should handle decryption errors gracefully', () => {
      mockCryptoService.decryptPayload.mockImplementation(() => {
        throw new Error('Decryption failed');
      });

      const result = service.decrypt(mockData1, mockData2);

      expect(result).toEqual({
        data: null,
        error_code: 'DECRYPTION_ERROR',
        successful: false,
      });
    });
  });
});
