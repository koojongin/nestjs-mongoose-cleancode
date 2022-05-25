import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const httpContext = context.switchToHttp();
    const request = httpContext.getRequest();
    const { authorization } = request.headers;

    if (!authorization) throw new UnauthorizedException();

    const [method, token] = authorization.split(' ');
    if (method !== 'Bearer') throw new UnauthorizedException();

    if (!token) throw new UnauthorizedException();

    const { userId } = await this.authService.validateJwtToken(token);
    const user = await this.authService.getUserById(userId);
    if (!user) throw new BadRequestException();
    request.user = user;
    return true;
  }
}
