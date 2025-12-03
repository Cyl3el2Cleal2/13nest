import { IsNotEmpty, IsObject, MaxLength, validateSync } from 'class-validator';

export class EncryptDto {
  @IsNotEmpty()
  @IsObject()
  payload: any;

  static validate(dto: EncryptDto) {
    const payloadString = JSON.stringify(dto.payload);

    if (payloadString.length === 0) {
      throw new Error('Payload cannot be empty');
    }

    if (payloadString.length > 2000) {
      throw new Error('Payload cannot exceed 2000 characters');
    }

    const errors = validateSync(dto);
    if (errors.length > 0) {
      throw new Error(
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
}

export class DecryptResponseDto extends BaseResponse {
  data: {
    payload: string;
  } | null;
}