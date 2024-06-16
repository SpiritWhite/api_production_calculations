import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { EmailRecoveryDTO, SingInAuthDto, SingUpAuthDto } from './dto';
import { IPayload } from '../common/interfaces';
import { IRequestUser } from './interfaces';
import { EmailRecovery, User } from './entities';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(EmailRecovery)
    private readonly emailRecoveryRepository: Repository<EmailRecovery>
  ) { }

  async signIn(signInAuthDto: SingInAuthDto) {
    const { email, username, password } = signInAuthDto;
    const existUser = await this.findOneUser(email, username, true);
    if (!existUser) throw new UnauthorizedException('Credential Error');
    if (!bcrypt.compareSync(password, existUser.password)) throw new UnauthorizedException('Credential Error');
    if (!existUser.isActive) throw new UnauthorizedException('User account is disable');
    delete existUser.password;
    const token = await this.generatedJWTToken({ sub: existUser.userId });
    const refreshToken = await this.generatedJWTToken({ sub: existUser.userId }, '15d');
    return {
      'detail': {
        user: { ...existUser },
        'accessToken': token,
        'refreshToken': refreshToken
      }
    };
  }

  async signUp(signUpAuthDto: SingUpAuthDto) {
    try {
      const { email, username } = signUpAuthDto;
      const existAccunt = await this.findOneUser(email);
      const existUsername = await this.findOneUser(undefined, username);
      if (existAccunt) throw new BadRequestException('User account already');
      if (existUsername) throw new BadRequestException('Username already');
      const salt = await bcrypt.genSalt();
      const password = await bcrypt.hash(signUpAuthDto.password, salt);
      const user = await this.userRepository.create({
        ...signUpAuthDto,
        password,
        createdBy: username,
        updatedBy: username
      });
      await this.userRepository.save(user);
      delete user.password;
      const token = await this.generatedJWTToken({ sub: user.userId });
      const refreshToken = await this.generatedJWTToken({ sub: user.userId }, '15d');
      return {
        'detail': {
          user,
          'accessToken': token,
          'refreshToken': refreshToken
        }
      };
    } catch (error) {
      this.logger.error(error.message);
      if (error instanceof BadRequestException) throw new BadRequestException(error.message);
      throw new InternalServerErrorException('Contact Technical Support');
    }
  }

  async signOut(user: IRequestUser) {
    return `Sign out user ${user.username}`;
  }

  async emailRecovery(emailRecoveryDto: EmailRecoveryDTO) {
    try {
      const { email } = emailRecoveryDto;
      const account = await this.findOneUser(email);
      if (!account) throw new BadRequestException('Account does not exist');
      const recovery = await this.emailRecoveryRepository.findOne({ where: { userId: account.userId } });
      const token = await this.generatedJWTToken({ sub: account.userId }, '24h');
      if (!recovery) {
        const emailRecovery = await this.emailRecoveryRepository.create({
          tokenRecovery: token.token,
          expireIn: token.expireAt,
          userId: account.userId,
          createdBy: account.username,
          updatedBy: account.username
        });
        await this.emailRecoveryRepository.save(emailRecovery);
        return { token };
      }
      const emailRecovery = await this.emailRecoveryRepository.update(account.userId ,{
        tokenRecovery: token.token,
        expireIn: token.expireAt,
        createdBy: account.username,
        updatedBy: account.username
      });
      // await this.emailRecoveryRepository.s(emailRecovery);
      return { token };
    } catch (error) {
      this.logger.error(error.message);
      if (error instanceof BadRequestException) throw new BadRequestException(error.message);
      throw new InternalServerErrorException('Contact Technical Support');
    }
  }

  async refreshToken(user: User) {
    try {
      const { userId } = user;
      const token = await this.generatedJWTToken({ sub: userId });
      return { 'detail': { user, 'accessToken': token } };
    } catch (error) {
      this.logger.error(error.message);
      throw new InternalServerErrorException('Contact Technical Support');
    }
  }

  private async generatedJWTToken(
    payload: object,
    expiresIn = this.configService.get<string>('jwtExpiresIn'),
  ) {
    const token = await this.jwtService.signAsync(payload, {
      expiresIn,
    });
    const { exp } = await this.jwtService.verifyAsync<IPayload>(token);
    return { token, expireAt: exp };
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
