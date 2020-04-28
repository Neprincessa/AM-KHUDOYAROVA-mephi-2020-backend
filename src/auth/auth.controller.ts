import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationDTO, LoginDTO } from '@app/models/user.dto';

@Controller('user')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post()
    register(@Body(ValidationPipe) credentials: RegistrationDTO){
       return this.authService.register(credentials);
    }

    @Post('/login')
    login(@Body(ValidationPipe) credentials: LoginDTO) {
        return this.authService.login(credentials);
    }
}