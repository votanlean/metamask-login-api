import { IsNotEmpty, IsString } from 'class-validator';

export class SignatureDto {
  @IsString()
  // @IsNotEmpty()
  readonly address: string;

  @IsString()
  // @IsNotEmpty()
  readonly signature: string;
}

export class AddressDto {
  @IsString()
  @IsNotEmpty()
  readonly address: string;
}
