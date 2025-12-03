
import { Test, TestingModule } from '@nestjs/testing';
import { ErrorFilter } from '../error.filter';
import { ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

describe('ErrorFilter', () => {
  let errorFilter: ErrorFilter;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    errorFilter = new ErrorFilter();
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  const createMockArgumentsHost = (response: Partial<Response>) => {
    return {
      switchToHttp: () => ({
        getResponse: () => response,
      }),
    } as unknown as ArgumentsHost;
  };

  describe('HttpException handling', () => {
    it('should handle BadRequestException with 400 status', () => {
      const { BadRequestException } = require('@nestjs/common');
      const exception = new BadRequestException('Invalid input');
      const host = createMockArgumentsHost(mockResponse);

      errorFilter.catch(exception, host);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        successful: false,
        error_code: 'BadRequestException',
        data: null,
      });
    });

    it('should handle HttpException with array messages', () => {
      const { HttpException, HttpStatus } = require('@nestjs/common');
      const exception = new HttpException(
        { message: ['Error 1', 'Error 2'] },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
      const host = createMockArgumentsHost(mockResponse);

      errorFilter.catch(exception, host);

      expect(mockResponse.status).toHaveBeenCalledWith(422);
      expect(mockResponse.json).toHaveBeenCalledWith({
        successful: false,
        error_code: 'HttpException',
        data: null,
      });
    });

    it('should handle HttpException with object response', () => {
      const { HttpException, HttpStatus } = require('@nestjs/common');
      const exception = new HttpException(
        { error: 'Custom error' },
        HttpStatus.BAD_REQUEST,
      );
      const host = createMockArgumentsHost(mockResponse);

      errorFilter.catch(exception, host);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        successful: false,
        error_code: 'HttpException',
        data: null,
      });
    });
  });

  describe('Non-HttpException handling', () => {
    it('should handle generic Error with 500 status', () => {
      const exception = new Error('Something went wrong');
      const host = createMockArgumentsHost(mockResponse);

      errorFilter.catch(exception, host);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        successful: false,
        error_code: 'INTERNAL_ERROR',
        data: null,
      });
    });

    it('should handle non-error object with 500 status', () => {
      const exception = 'String error';
      const host = createMockArgumentsHost(mockResponse);

      errorFilter.catch(exception, host);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        successful: false,
        error_code: 'INTERNAL_ERROR',
        data: null,
      });
    });

    it('should handle null/undefined exception', () => {
      const exception = null;
      const host = createMockArgumentsHost(mockResponse);

      errorFilter.catch(exception, host);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        successful: false,
        error_code: 'INTERNAL_ERROR',
        data: null,
      });
    });
  });

  describe('Response format consistency', () => {
    it('should always return consistent response structure', () => {
      const { InternalServerErrorException } = require('@nestjs/common');
      const exception = new InternalServerErrorException('Server error');
      const host = createMockArgumentsHost(mockResponse);

      errorFilter.catch(exception, host);

      const response = mockResponse.json.mock.calls[0][0];

      expect(response).toHaveProperty('successful', false);
      expect(response).toHaveProperty('error_code');
      expect(response).toHaveProperty('data', null);
    });
  });
});
