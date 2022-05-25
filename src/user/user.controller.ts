import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserService } from '@/src/user/user.service';
import { UserRegisterRequestDto } from '@/user/dto/register-request.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@/auth/auth.guard';
import { RequestUser } from '@/common/decorator/request-user';
import { User, UserDocument } from '@/user/user.schema';
import { SalePermissionRequestDto } from '@/user/dto/sale-permission-request.dto';
import { UserLoginRequestDto } from '@/user/dto/login-request.dto';

@ApiTags('User')
@Controller({
  path: 'user',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: '로그인',
    description: '로그인',
  })
  @Post('login')
  async login(@Body() userLoginRequestDto: UserLoginRequestDto) {
    const user = await this.userService.login(userLoginRequestDto);
    return user;
  }

  @ApiOperation({
    summary: '회원가입',
    description: '회원가입',
  })
  @Post()
  async register(@Body() userRegisterRequestDto: UserRegisterRequestDto) {
    const user = await this.userService.register(userRegisterRequestDto);
    return user;
  }

  @ApiOperation({
    summary: '셀러 입점 정보 등록',
    description: '셀러 입점 정보 등록',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post('request-sale-permission')
  async requestSalePermission(
    @RequestUser() requestUser: UserDocument,
    @Body() salePermissionRequestDto: SalePermissionRequestDto
  ) {
    return this.userService.requestSalePermission(requestUser, salePermissionRequestDto);
  }
}
