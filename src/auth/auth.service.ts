import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { CryptoService } from '@/crypto/crypto.service';
import { ObjectId } from 'mongoose';
import { UserRegisterRequestDto } from '@/user/dto/register-request.dto';
import { UserRepository } from '@/user/user.repository';
import { UserLoginRequestDto } from '@/user/dto/login-request.dto';

export interface JwtPayLoad {
  userId: ObjectId;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly cryptoService: CryptoService,
    private readonly userRepository: UserRepository
  ) {}

  async login(userLoginRequestDto: UserLoginRequestDto) {
    const { identifier, password } = userLoginRequestDto;
    const user = await this.userRepository.findOne({ identifier });
    const { password: hashedPassword } = user;
    const isVerified = await this.cryptoService.validateHash(password, hashedPassword);
    if (!isVerified) throw new HttpException(`invalid id or password`, HttpStatus.UNAUTHORIZED);

    const payload: JwtPayLoad = {
      userId: user._id,
    };
    const getJwtOptions = (options?: JwtSignOptions) => {
      return Object.assign({}, options);
    };
    const accessToken = await this.jwtService.signAsync(payload, getJwtOptions());
    return { user, accessToken };
  }

  async register(userRegisterRequestDto: UserRegisterRequestDto) {
    const { identifier, password } = userRegisterRequestDto;
    const user = await this.userRepository.findOne({
      identifier,
    });

    if (user) throw new HttpException(`이미 존재하는 계정입니다.`, HttpStatus.CONFLICT);

    const hashedPassword = await this.cryptoService.generateHash(password);
    const createdUser = await this.userRepository.create({
      identifier,
      password: hashedPassword,
    });
    return createdUser;
  }

  async getUserById(_id: string | ObjectId) {
    return this.userRepository.findOne({ _id });
  }

  async validateJwtToken(token: string): Promise<JwtPayLoad> {
    const payload = await this.jwtService.verifyAsync<JwtPayLoad>(token);
    return payload;
  }
}
