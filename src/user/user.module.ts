import { Module } from '@nestjs/common';
import { UserService } from '@/src/user/user.service';
import { UserController } from '@/src/user/user.controller';
import { DatabaseModule } from '@/database/database.modules';
import { UserRepository } from '@/user/user.repository';
import { AuthService } from '@/auth/auth.service';
import { MarketRepository } from '@/market/market.repository';

@Module({
  imports: [DatabaseModule],
  providers: [UserRepository, UserService, AuthService, UserController, MarketRepository],
  exports: [UserRepository, UserService],
})
export class UserModule {}
