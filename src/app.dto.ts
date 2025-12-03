import {
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';
import { BadRequestException } from '@nestjs/common';

export class EncryptDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  payload: string;
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
