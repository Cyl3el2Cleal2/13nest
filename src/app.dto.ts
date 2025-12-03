import { IsNotEmpty, IsObject, MaxLength, validateSync } from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export class EncryptDto {
  @IsNotEmpty()
  @IsObject()
  payload: any;

  static validate(dto: EncryptDto) {
    if (!dto.payload) {
      throw new BadRequestException('Payload is required');
    }
    const payloadString = JSON.stringify(dto.payload);

    if (payloadString.length === 0) {
      throw new BadRequestException('Payload cannot be empty');
    }

    if (payloadString.length > 2000) {
      throw new BadRequestException('Payload cannot exceed 2000 characters');
    }

    const errors = validateSync(dto);
    if (errors.length > 0) {
      throw new BadRequestException(
        errors.map((e) => Object.values(e.constraints || {})).join(', '),
      );
    }
  }
}

class BaseResponse {
  successful: boolean;
  error_code: string;
}
export class EncryptResponseDto extends BaseResponse {
  data: {
    data1: string;
    data2: string;
  } | null;
}

export class DecryptDto {
  data1: string;
  data2: string;

  static validate(dto: DecryptDto) {
    if (!dto.data1 || !dto.data2) {
      throw new BadRequestException('Both data1 and data2 are required');
    }
  }
}

export class DecryptResponseDto extends BaseResponse {
  data: {
    payload: string;
  } | null;
}
