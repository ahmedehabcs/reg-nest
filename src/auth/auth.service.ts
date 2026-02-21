import { Injectable, BadRequestException, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from "bcrypt";
import { LoginDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {

  constructor(private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService
  ) { }

  async signup(createAuthDto: CreateAuthDto) {
    const { name, email, password } = createAuthDto;
    const emailInUse = await this.prismaService.user.findUnique({ where: { email } });
    if (emailInUse) throw new BadRequestException('Email already exists');
    const hashPassword = await bcrypt.hash(password, 10);
    return this.prismaService.user.create({
      data: {
        name,
        email,
        password: hashPassword
      },
    });
  }


  async login(credential: LoginDto) {
    const { email, password } = credential;
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('invalid credential');
    const compare = await bcrypt.compare(password, user.password);
    if (!compare) throw new UnauthorizedException('invalid credential');
    return this.generateUserToken(user.id);
  }

  async refreshTokens(refreshToken: string) {
    const tokenRecord = await this.prismaService.refreshToken.findUnique({
      where: {
        token: refreshToken,
        expiresAt: { gte: new Date() },
      },
    });

    if (!tokenRecord) throw new UnauthorizedException('Refresh token is invalid or expired');
    await this.prismaService.refreshToken.delete({
      where: { id: tokenRecord.id },
    });

    return this.generateUserToken(tokenRecord.userId)
  }

  async generateUserToken(userId: number) {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '1h' });
    const refreshToken = uuidv4();
    await this.storeRefreshToken(refreshToken, userId);
    return { accessToken, refreshToken }
  }

  async storeRefreshToken(token: string, userId: number) {
    await this.prismaService.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      }
    })
  }

}
