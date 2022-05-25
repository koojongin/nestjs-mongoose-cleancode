import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ProductCreateRequestDto } from '@/product/dto/create-request.dto';
import { ProductCategory, ProductRegion } from '@/product/product.schema';

export class ProductUpdateRequestDto extends ProductCreateRequestDto {
  @ApiProperty({ description: '상품 아이디' })
  @IsString()
  @IsNotEmpty()
  _id: string;

  @ApiProperty({ description: '상품명', default: 'VANS UA OG CLASSIC SLIP-ON LX' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: '상품 설명',
    default: `Artikelnummer:
VN0A45JK4L21
Geschlecht:
Women
Farbe:
RACING RED
Material:
Gesamt: 100% Leder/Textil

안녕하세요? 😀
재고를 보유하지 않고,
고객님 주문 즉시 발주를 넣어 발송해드립니다.
100% 정품입니다.
모든 등록된 상품은 관부가세 미포함 가격입니다.

최대한 빠르게 수령하실 수 있도록 노력하겠습니다.🚀

감사합니다.

* 혹 원사는 사이즈 있으시면 가능여부 확인 도와드리겠으며,
기타 문의사항 채팅 남겨주시면 확인되는데로 바로 답변드리겠습니다 :)`,
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({ description: '카테고리', default: 'PASSION' })
  @IsEnum(ProductCategory)
  @IsOptional()
  category: ProductCategory;

  @ApiProperty({ description: '국가', default: 'JAPAN' })
  @IsEnum(ProductRegion)
  @IsOptional()
  region: string;

  @ApiProperty({ description: '가격', default: 1000 })
  @IsNumber()
  @IsOptional()
  price: number;
}
