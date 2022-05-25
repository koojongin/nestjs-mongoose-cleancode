import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SalePermissionRequestDto {
  @ApiProperty({ description: '마켓 설명', default: '100% 정품 빠른 유럽 직배송 밀리런던' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: '마켓 이름', default: '밀리x런던' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
