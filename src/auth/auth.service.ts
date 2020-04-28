import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { LoginDTO, RegistrationDTO } from '@app/models/user.dto';

@Injectable()
export class AuthService {
    private mockUser = {
        email: 'fff@ff.com',
        token: 'jwt.token.here',
        username: 'bobik',
        password: 'piggydog',
    };

   register(credentials: RegistrationDTO) {
       return this.mockUser;
   }
   login(credentials: LoginDTO) {
        if (credentials.email === this.mockUser.email) {
            return this.mockUser;
        }
        throw new InternalServerErrorException();
   } 
}

