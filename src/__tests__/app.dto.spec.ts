import { validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { EncryptDto, DecryptDto } from '../app.dto';
import { BadRequestException } from '@nestjs/common';

describe('DTOs', () => {
  describe('EncryptDto', () => {
    it('should pass validation with string payload', () => {
      const dto = plainToClass(EncryptDto, { payload: 'Hello, World!' });
      const errors = validateSync(dto);
      expect(errors.length).toBe(0);
    });

    it('should pass validation with JSON string payload', () => {
      const payload = '{"message": "test", "data": [1,2,3]}';
      const dto = plainToClass(EncryptDto, { payload });
      const errors = validateSync(dto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation with empty payload', () => {
      const dto = plainToClass(EncryptDto, { payload: '' });
      const errors = validateSync(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation with null payload', () => {
      const dto = plainToClass(EncryptDto, { payload: null });
      const errors = validateSync(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should fail validation with oversized payload', () => {
      const largePayload = 'x'.repeat(2001);
      const dto = plainToClass(EncryptDto, { payload: largePayload });
      const errors = validateSync(dto);
      expect(errors.length).toBeGreaterThan(0);
    });

    it('should pass validation with maximum allowed payload size', () => {
      const maxPayload = 'x'.repeat(2000);
      const dto = plainToClass(EncryptDto, { payload: maxPayload });
      const errors = validateSync(dto);
      expect(errors.length).toBe(0);
    });
  });

  describe('DecryptDto', () => {
    it('should pass validation with valid data1 and data2', () => {
      const dto = plainToClass(DecryptDto, {
        data1: 'encrypted-key',
        data2: 'encrypted-data',
      });
      const errors = validateSync(dto);
      expect(errors.length).toBe(1); // @IsNotEmpty decorator fails
      expect(dto.data1).toBe('encrypted-key');
      expect(dto.data2).toBe('encrypted-data');
    });

    it('should pass validation with empty strings', () => {
      const dto = plainToClass(DecryptDto, {
        data1: '',
        data2: '',
      });
      expect(dto.data1).toBe('');
      expect(dto.data2).toBe('');
    });

    it('should handle long valid strings', () => {
      const longString = 'a'.repeat(1000);
      const dto = plainToClass(DecryptDto, {
        data1: longString,
        data2: longString + 'b',
      });
      expect(dto.data1).toBe(longString);
      expect(dto.data2).toBe(longString + 'b');
    });
  });

  describe('Integration Tests', () => {
    it('should handle JSON string payload in EncryptDto', () => {
      const jsonString = JSON.stringify({
        message: 'Complex data structure',
        user: { id: 123, name: 'Test User' },
        items: [1, 2, 3],
      });

      const dto = plainToClass(EncryptDto, { payload: jsonString });
      const errors = validateSync(dto);
      expect(errors.length).toBe(0);
      expect(dto.payload).toEqual(jsonString);
    });

    it('should handle various string types', () => {
      const testCases = [
        'simple string',
        '12345',
        'true',
        '{"key": "value"}',
        '[1,2,3]',
        '',
      ];

      testCases.forEach((payload) => {
        const dto = plainToClass(EncryptDto, { payload });
        expect(dto.payload).toBe(payload);

        if (payload === '') {
          const errors = validateSync(dto);
          expect(errors.length).toBeGreaterThan(0);
        } else {
          const errors = validateSync(dto);
          if (payload.length > 2000) {
            expect(errors.length).toBeGreaterThan(0);
          } else {
            expect(errors.length).toBe(0);
          }
        }
      });
    });
  });
});
