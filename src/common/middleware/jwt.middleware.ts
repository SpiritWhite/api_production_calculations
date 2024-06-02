import { Request, Response, NextFunction } from 'express';
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IPayload } from '../interfaces';
import { User } from '../../auth/entities';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = this.extractTokenFromHeader(req);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: IPayload =
        await this.jwtService.verifyAsync(token, {
          secret: this.configService.get<string>('jwtSecret'),
        });

      const user = await this.userRepository.findOneBy({ userId: payload['sub'] });

      if (!user) throw new UnauthorizedException('User account not exist');
      if (!user.isActive) throw new UnauthorizedException('User account is disabled. Contact with Technical Support');
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      req['user'] = user;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
    next();
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
