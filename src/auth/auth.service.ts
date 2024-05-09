import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SingInAuthDto, SingUpAuthDto } from './dto';
import { IPayload } from '../common/interfaces';
import { IRequestUser } from './interfaces';
import { User } from './entities';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async singIn(singInAuthDto: SingInAuthDto) {
    const { email, username, password } = singInAuthDto;
    const existUser = await this.findOneUser(email, username, true);
    if (!existUser) throw new UnauthorizedException('Credential Error');
    if (!bcrypt.compareSync(password, existUser.password)) throw new UnauthorizedException('Credential Error');
    if (!existUser.isActive) throw new UnauthorizedException('User account is disable');
    delete existUser.password;
    const token = await this.generatedJWTToken({ sub: existUser.userId });
    return { user: { ...existUser }, token };
  }

  async singUp(singUpAuthDto: SingUpAuthDto) {
    try {
      const { email, username } = singUpAuthDto;
      const existUser = await this.findOneUser(email, username);
      if (existUser) throw new BadRequestException('User account already');
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash(singUpAuthDto.password, salt);
      const user = await this.userRepository.create({
        ...singUpAuthDto,
        password,
        createdBy: username,
        updatedBy: username,
        isOnline: true
      });
      await this.userRepository.save(user);
      delete user.password;
      const token = await this.generatedJWTToken({ sub: user.userId });
      return { user, token };
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException('Contact Technical Support');
    }
  }

  async singOut(user: IRequestUser) {
    return `Sing out user ${user.username}`;
  }

  async refreshToken(user: User) {
    try {
      const { userId } = user;
      const token = await this.generatedJWTToken({ sub: userId });
      return { user, token };
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException('Contact Technical Support');
    }
  }

  private async generatedJWTToken(
    payload: object,
    expiresIn = this.configService.get<string>('jwtExpiresIn'),
  ) {
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn,
    });
    const { exp } = await this.jwtService.verifyAsync<IPayload>(access_token);
    return { access_token, expireAt: exp };
  }

  private async findOneUser(email?: string, username?: string, password = false): Promise<User> {
    try {
      const user = await this.userRepository.findOne({ where: { email, username }, select: { ...this.getCols(this.userRepository), password } });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  private getCols<T>(repository: Repository<T>): (keyof T)[] {
    let datos = {};
    repository.metadata.columns.filter(ft => ft.propertyName !== 'password').map(col => {
      datos = { ...datos, [col.propertyName]: true  }
    })
    return datos as (keyof T)[];
  }
}
