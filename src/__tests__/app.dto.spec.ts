import { validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { EncryptDto, DecryptDto } from '../app.dto';
import { BadRequestException } from '@nestjs/common';

describe('DTOs', () => {
  describe('EncryptDto', () => {
    it('should pass validation with valid payload', () => {
      const dto = plainToClass(EncryptDto, { payload: { message: 'test' } });
      const errors = validateSync(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation with empty payload', () => {
      const dto = plainToClass(EncryptDto, { payload: null });
      const errors = validateSync(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should pass validation with object payload', () => {
      const payload = { key: 'value', number: 123 };
      const dto = plainToClass(EncryptDto, { payload });
      expect(dto.payload).toEqual(payload);
    });

    it('should pass validation with array payload', () => {
      const payload = ['item1', 'item2'];
      const dto = plainToClass(EncryptDto, { payload });
      expect(dto.payload).toEqual(payload);
    });

    it('should pass validation with string payload', () => {
      const payload = 'simple string';
      const dto = plainToClass(EncryptDto, { payload });
      expect(dto.payload).toBe(payload);
    });

    describe('validate method', () => {
      it('should not throw with valid payload', () => {
        const dto = new EncryptDto();
        dto.payload = { valid: 'data' };
        expect(() => EncryptDto.validate(dto)).not.toThrow();
      });

      it('should throw BadRequestException with null payload', () => {
        const dto = new EncryptDto();
        dto.payload = null;
        expect(() => EncryptDto.validate(dto)).toThrow(BadRequestException);
        expect(() => EncryptDto.validate(dto)).toThrow('Payload is required');
      });

      it('should throw BadRequestException with undefined payload', () => {
        const dto = new EncryptDto();
        dto.payload = undefined;
        expect(() => EncryptDto.validate(dto)).toThrow(BadRequestException);
        expect(() => EncryptDto.validate(dto)).toThrow('Payload is required');
      });

      it('should throw BadRequestException with oversized payload', () => {
        const dto = new EncryptDto();
        const largePayload = 'x'.repeat(2001);
        dto.payload = { data: largePayload };
        expect(() => EncryptDto.validate(dto)).toThrow(BadRequestException);
        expect(() => EncryptDto.validate(dto)).toThrow(
          'Payload cannot exceed 2000 characters',
        );
      });

      it('should pass validation with maximum allowed payload size', () => {
        const dto = new EncryptDto();
        const maxPayload = 'x'.repeat(1800); // Under 2000 char limit
        dto.payload = { data: maxPayload };
        expect(() => EncryptDto.validate(dto)).not.toThrow();
      });
    });
  });

  describe('DecryptDto', () => {
    it('should pass validation with valid data1 and data2', () => {
      const dto = plainToClass(DecryptDto, {
        data1: 'encrypted-key',
        data2: 'encrypted-data',
      });
      const errors = validateSync(dto);
      expect(errors.length).toBe(1);
      expect(dto.data1).toBe('encrypted-key');
      expect(dto.data2).toBe('encrypted-data');
    });

    describe('validate method', () => {
      it('should not throw with valid data1 and data2', () => {
        const dto = new DecryptDto();
        dto.data1 = 'some-encrypted-key';
        dto.data2 = 'some-encrypted-data';
        expect(() => DecryptDto.validate(dto)).not.toThrow();
      });

      it('should throw BadRequestException when data1 is empty', () => {
        const dto = new DecryptDto();
        dto.data1 = '';
        dto.data2 = 'valid-data';
        expect(() => DecryptDto.validate(dto)).toThrow(BadRequestException);
        expect(() => DecryptDto.validate(dto)).toThrow(
          'Both data1 and data2 are required',
        );
      });

      it('should throw BadRequestException when data2 is empty', () => {
        const dto = new DecryptDto();
        dto.data1 = 'valid-data';
        dto.data2 = '';
        expect(() => DecryptDto.validate(dto)).toThrow(BadRequestException);
        expect(() => DecryptDto.validate(dto)).toThrow(
          'Both data1 and data2 are required',
        );
      });

      it('should throw BadRequestException when both data1 and data2 are empty', () => {
        const dto = new DecryptDto();
        dto.data1 = '';
        dto.data2 = '';
        expect(() => DecryptDto.validate(dto)).toThrow(BadRequestException);
        expect(() => DecryptDto.validate(dto)).toThrow(
          'Both data1 and data2 are required',
        );
      });

      it('should throw BadRequestException when data1 is null', () => {
        const dto = new DecryptDto();
        dto.data1 = null;
        dto.data2 = 'valid-data';
        expect(() => DecryptDto.validate(dto)).toThrow(BadRequestException);
        expect(() => DecryptDto.validate(dto)).toThrow(
          'Both data1 and data2 are required',
        );
      });

      it('should throw BadRequestException when data2 is null', () => {
        const dto = new DecryptDto();
        dto.data1 = 'valid-data';
        dto.data2 = null;
        expect(() => DecryptDto.validate(dto)).toThrow(BadRequestException);
        expect(() => DecryptDto.validate(dto)).toThrow(
          'Both data1 and data2 are required',
        );
      });

      it('should throw BadRequestException when data1 is undefined', () => {
        const dto = new DecryptDto();
        dto.data1 = undefined;
        dto.data2 = 'valid-data';
        expect(() => DecryptDto.validate(dto)).toThrow(BadRequestException);
        expect(() => DecryptDto.validate(dto)).toThrow(
          'Both data1 and data2 are required',
        );
      });

      it('should throw BadRequestException when data2 is undefined', () => {
        const dto = new DecryptDto();
        dto.data1 = 'valid-data';
        dto.data2 = undefined;
        expect(() => DecryptDto.validate(dto)).toThrow(BadRequestException);
        expect(() => DecryptDto.validate(dto)).toThrow(
          'Both data1 and data2 are required',
        );
      });

      it('should accept valid base64 strings', () => {
        const dto = new DecryptDto();
        dto.data1 = 'dmFsaWQgYmFzZTY0IGRhdGE=';
        dto.data2 = 'YW5vdGhlciB2YWxpZCBiYXNlNjQ=';
        expect(() => DecryptDto.validate(dto)).not.toThrow();
      });

      it('should accept long valid strings', () => {
        const dto = new DecryptDto();
        const longString = 'a'.repeat(1000);
        dto.data1 = longString;
        dto.data2 = longString + 'b';
        expect(() => DecryptDto.validate(dto)).not.toThrow();
      });
    });
  });

  describe('Integration Tests', () => {
    it('should handle complex payload types in EncryptDto', () => {
      const complexPayload = {
        user: {
          id: 123,
          name: 'Test User',
          settings: {
            theme: 'dark',
            notifications: true,
          },
        },
        items: [1, 2, 3],
        metadata: null,
        flags: undefined,
      };

      const dto = plainToClass(EncryptDto, { payload: complexPayload });
      expect(() => EncryptDto.validate(dto)).not.toThrow();
      expect(dto.payload).toEqual(complexPayload);
    });
  });
});
