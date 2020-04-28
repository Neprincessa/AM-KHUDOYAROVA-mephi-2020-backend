import { Injectable, InternalServerErrorException, UnauthorizedException, ConflictException } from '@nestjs/common';
import { LoginDTO, RegistrationDTO } from '@app/models/user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@app/user/entity/user.entity';
import { Repository } from 'typeorm';
import {JwtService} from '@nestjs/jwt';

@Injectable()
export class AuthService {
    // private mockUser = {
    //     email: 'fff@ff.com',
    //     token: 'jwt.token.here',
    //     username: 'bobik',
    //     password: 'piggydog',
    // };

    constructor (
        @InjectRepository(UserEntity) private userRepo:
        Repository<UserEntity>,
        private jwtService: JwtService
    ) {
    }


   async register(credentials: RegistrationDTO) {
       try {
           const user = this.userRepo.create(credentials);
           await user.save();
           const payload = {username: user.username};
           const token = this.jwtService.sign(payload);
           return  {user:{...user.toJSON(), token}};
       } catch  (err) {
           if (err.code === '23505') {
               throw new ConflictException('Username has been already taken');
           }
           throw new InternalServerErrorException();
       }
    //    return this.mockUser;
   }

//    async login(credentials: LoginDTO) {
    async login({email, password}: LoginDTO) {
        try {
            const user = await this.userRepo.findOne({where: {email}});
            const isValid = await user.comparePassword(password);
            console.log(isValid)
            if (!isValid) {
                throw new UnauthorizedException("Invalid credentials");
            }
            const payload = {username: user.username};
            const token = this.jwtService.sign(payload);
            return {user:{...user.toJSON(), token}};
        } catch (err) {
            throw new UnauthorizedException("Invalid credentials");
        }
        // if (credentials.email === this.mockUser.email) {
        //     return this.mockUser;
        // }
        // throw new InternalServerErrorException();
   } 
}

