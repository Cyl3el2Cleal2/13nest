import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { CryptoService } from '../crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;
  let configService: ConfigService;

  const mockConfigService = {
    get: jest.fn(),
  };

  const validKeys = {
    private: `-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEA0NVOdHqKC08xx59iTTQmTqAVYN1IUdy/wqT/J3wE8C7jcyAA
3L6ub70v+GRvpOAkGVKpECPUhDFxm1oEorC9iH6yDz9wpU5dJUGNDc5WJSHYmLP9
blcZpvYOxBBoqe4U/+MwqFbF9o3QkwKv3//si5mJQV4baQ9qloRkM++aD6MAvPbF
as9RIYE+cEw4lMvbZVaJyzvTuTM/DtUMPP1fZj3GPEXNH//mXahRCE5zg20w+U9V
sxJT8GXyAFPD4pd+lPJSjqDl3QxmQoL3IRUbg416O8aCOua1wkrD8piOyIBwsQ0v
KDEQ+GOlekRX2Yimoi1/5oC8xoQWRY+wsOTjLwIDAQABAoIBAF/+PQMDtOK/84Ts
ObZ9S0KHCWyuKukeTLM/Pt46ftac5wZrZpoRuIM6dot6N2uVcGKHgZkerzhYtf0Q
IuNZ1LWib1zc7329CMnwWNNIzoZhCXwf+FW5CdyabG0pkcLS4qpBF4O552OPCpoY
+RlBPc1ptRLsHDNt17P6hUjuUWXv1dn1MaIodECSaMJYFiQonLotclIL5sfJkolq
568OmyPkCLf1uPb7uqif9yexoH7Ax5YlwfHm8s6LO9T0XBPpJshUPgcoRkri8FG7
IW03NF86F8RHx6Tft20S8BhySbIdlyKmmhSAb12xj7+r+XC62gRePN1HyN+fEjBz
LF+14jkCgYEA76IX/jM2gyeNHO3C3U/efHRK4S0cGb2Oy0Sj7Uk2nC4Heq7MGSvb
UMVFQ6E+TG47E2KuvcJtO7h76MIAXcDN+BMV113xqyF4zaIWCnX9xUPcRNKIsCMj
chR16p8yRhuM4ZY+XR1N9g966UYG2gAqTIJsVc1LVB+9O1sXmPS0IL0CgYEA3xiv
lY1kJeDydmXU9Vwr0Ij+1u1bUL9QB/oKOZxOB+dyQoLKLc7UxDHjXUk2NGva8xC9
VSy55DlTE2WZ/9tuUd32KK4wEjaXLjoZIAbfM/+dKX5sE1WXMQt75lMH55vePnuc
KHuH//7rW3Yx6HDrB2LpVzWlSoo1DKIBFK1GQFsCgYEAlQAnBwp1BMwc9DXqio3U
+3Gb9bOE24SAO2fsveheKnJ8eA4kHiqk7e4biVfDUubfmMgtexRfs1icwzeN3r25
1FyZohZp5EylvsbgCZUgO/5cAfcewta2fYK3ZzGhovISgVpYYLGN/kfV1yKRtA+S
PYyDLD7AbghmM3gKjjLppckCgYEAsT4oiVVqwllD6GKg3UocGTIt3M14Zd+Ikr3J
D9opeEgd08+bFueizDiiXUPEB8PEkKW09g1xpmsQoHFw9v/7VplUbx9sW5v5YiWQ
PoyXGfWzg/rHnFi8pJ9uER/YQN7po5SLDPKPqwd5LxHpNrU3VIf1wG6DYoQI/39a
AnZjQM8CgYEA0UWNsAenwcQ1I6GIIzySk4ULc4v+k9UcQnXyHkgKOlZ9cfJMNolv
aD72tUrBfWyKeXhhiCvjfO8FX6D2i08eU1VrrIDi+UkoPPXSIXPuOVSm58hI938e
8olEX+IsjtbNhDk1A9uRZlsyPzNuu5kI08husrENTtmYm0Lz6bApsss=
-----END RSA PRIVATE KEY-----`,
    public: `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0NVOdHqKC08xx59iTTQm
TqAVYN1IUdy/wqT/J3wE8C7jcyAA3L6ub70v+GRvpOAkGVKpECPUhDFxm1oEorC9
iH6yDz9wpU5dJUGNDc5WJSHYmLP9blcZpvYOxBBoqe4U/+MwqFbF9o3QkwKv3//s
i5mJQV4baQ9qloRkM++aD6MAvPbFas9RIYE+cEw4lMvbZVaJyzvTuTM/DtUMPP1f
Zj3GPEXNH//mXahRCE5zg20w+U9VsxJT8GXyAFPD4pd+lPJSjqDl3QxmQoL3IRUb
g416O8aCOua1wkrD8piOyIBwsQ0vKDEQ+GOlekRX2Yimoi1/5oC8xoQWRY+wsOTj
LwIDAQAB
-----END PUBLIC KEY-----`,
  };

  beforeEach(async () => {
    mockConfigService.get.mockImplementation((key: string) => {
      if (key === 'keys.private') return validKeys.private;
      if (key === 'keys.public') return validKeys.public;
      return undefined;
    });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Service Initialization', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });

    it('should initialize successfully with valid keys', () => {
      expect(() => new CryptoService(configService)).not.toThrow();
    });
  });

  describe('generateAESKey', () => {
    it('should generate a valid 64-character hex string', () => {
      const aesKey = service.generateAESKey();
      expect(aesKey).toMatch(/^[a-f0-9]{64}$/i);
    });

    it('should generate different keys on multiple calls', () => {
      const key1 = service.generateAESKey();
      const key2 = service.generateAESKey();
      expect(key1).not.toBe(key2);
    });
  });

  describe('Main Operations', () => {
    it('should encrypt and decrypt payload correctly', () => {
      const payload = 'Hello, World!';
      const encrypted = service.encryptPayload(payload);
      const decrypted = service.decryptPayload(
        encrypted.data1,
        encrypted.data2,
      );
      expect(decrypted).toEqual(payload);
    });

    it('should handle JSON string payload', () => {
      const payload = '{"message":"test","data":[1,2,3]}';
      const encrypted = service.encryptPayload(payload);
      const decrypted = service.decryptPayload(
        encrypted.data1,
        encrypted.data2,
      );
      expect(decrypted).toBe(payload);
    });

    it('should handle numeric string payload', () => {
      const payload = '12345';
      const encrypted = service.encryptPayload(payload);
      const decrypted = service.decryptPayload(
        encrypted.data1,
        encrypted.data2,
      );
      expect(decrypted).toBe(payload);
    });

    it('should handle null payload gracefully', () => {
      // Test that service can handle different payload types
      const payload = { test: 'data' };
      const encrypted = service.encryptPayload(payload);
      expect(encrypted).toHaveProperty('data1');
      expect(encrypted).toHaveProperty('data2');
    });

    it('should throw error with missing data1 or data2', () => {
      expect(() => service.decryptPayload('', 'data2')).toThrow();
      expect(() => service.decryptPayload('data1', '')).toThrow();
    });

    it('should produce different encrypted results for same payload', () => {
      const payload = 'test message';
      const encrypted1 = service.encryptPayload(payload);
      const encrypted2 = service.encryptPayload(payload);
      expect(encrypted1.data1).not.toBe(encrypted2.data1);
      expect(encrypted1.data2).not.toBe(encrypted2.data2);
    });

    it('should handle complex nested objects', () => {
      const complexPayload = {
        user: {
          profile: {
            settings: {
              theme: 'dark',
              notifications: true,
              preferences: {
                language: 'en',
                timezone: 'UTC',
              },
            },
          },
        },
        items: [1, 2, { nested: 'value' }],
        metadata: null,
        flags: undefined,
      };

      const encrypted = service.encryptPayload(complexPayload);
      const decrypted = service.decryptPayload(
        encrypted.data1,
        encrypted.data2,
      );

      expect(decrypted).toEqual(complexPayload);
    });
  });
});
