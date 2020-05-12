import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class LoginDTO {
  @IsEmail()
  @IsString()
  @MinLength(4)
  email: string;

  @IsString()
  @MinLength(4)
  password: string;
}
export class RegisterDTO extends LoginDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  name: string;

  @IsString()
  surname: string;
}

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  surname: string;
}

export interface AuthPayload {
  username: string;
}

export interface UserResponse {
  email: string;
  username: string;
  name: string;
  surname: string;
}

export interface AuthResponse extends UserResponse {
  token: string;
}
