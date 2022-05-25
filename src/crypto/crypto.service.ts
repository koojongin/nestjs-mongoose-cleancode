import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptoService {
  private readonly SALT_ROUNDS = 10;

  /**
   * 해시 생성
   * @param plainText
   */
  async generateHash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.SALT_ROUNDS);
  }

  /**
   * 해시 검증
   * @param plainText
   * @param hash
   */
  async validateHash(plainText: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hash);
  }
}
