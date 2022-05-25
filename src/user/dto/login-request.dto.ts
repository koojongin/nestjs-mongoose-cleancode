import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserLoginRequestDto {
  @ApiProperty({ description: '아이디', default: 'test' })
  @IsString()
  @IsNotEmpty()
  identifier: string;

  @ApiProperty({ description: '비밀번호', default: '1234' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
