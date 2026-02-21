import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from "./dto/login-auth.dto";
import { RefreshTokenDto } from './dto/refresh-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup') // auth/signup
  async signUp(@Body() createAuthDto: CreateAuthDto){
    return this.authService.signup(createAuthDto);
  }
  
  @Post('login') // auth/signup
  async login(@Body() credential: LoginDto){
    return this.authService.login(credential);
  }

  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto){
    return this.authService.refreshTokens(refreshTokenDto.token);
  }

}
