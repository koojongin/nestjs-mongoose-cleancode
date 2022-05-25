import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserRepository } from '@/user/user.repository';
import { UserRegisterRequestDto } from '@/user/dto/register-request.dto';
import { AuthService } from '@/auth/auth.service';
import { UserLoginRequestDto } from '@/user/dto/login-request.dto';
import { SalePermissionRequestDto } from '@/user/dto/sale-permission-request.dto';
import { User, UserDocument } from '@/user/user.schema';
import { MarketRepository } from '@/market/market.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
    private readonly marketRepository: MarketRepository
  ) {}

  async login(userLoginRequestDto: UserLoginRequestDto) {
    return this.authService.login(userLoginRequestDto);
  }

  async register(userRegisterRequestDto: UserRegisterRequestDto) {
    return this.authService.register(userRegisterRequestDto);
  }

  async requestSalePermission(user: UserDocument, salePermissionRequestDto: SalePermissionRequestDto) {
    // Request기 때문에 사실 셀러의 승인의 과정이 있는게 더 좋지만 개발의 목적이 완성이 아니기 때문에 바로 승인되는 구조로 개발하였습니다.

    const { _id: userId } = user;
    const { name } = salePermissionRequestDto;

    const market = await this.marketRepository.findOne({ name });
    if (market) throw new HttpException('이미 존재하는 마켓명입니다.', HttpStatus.CONFLICT);

    user.isSeller = true;
    const [createdMarket, updatedUser] = await Promise.all([
      this.marketRepository.create({
        ...salePermissionRequestDto,
        owner: userId,
      }),
      user.save(),
    ]);

    return {
      market: createdMarket,
      user: updatedUser,
    };
  }
}
