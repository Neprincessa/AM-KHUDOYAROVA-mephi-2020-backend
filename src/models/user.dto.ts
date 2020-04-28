import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDTO {
    @IsEmail()
    @IsString()
    @MinLength(4)
    email: string;

    @IsString()
    @MinLength(4)
    password: string;  

}
export class RegistrationDTO {
    @IsString()
    @MinLength(4)
    @MaxLength(20)
    username: string;
}
