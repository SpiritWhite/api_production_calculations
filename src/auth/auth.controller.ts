import { Controller, Get, Post, Body, HttpCode, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SingInAuthDto, SingUpAuthDto } from './dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @Post('sign-in')
  signIn(@Body() singInAuthDto: SingInAuthDto) {
    return this.authService.singIn(singInAuthDto);
  }

  @HttpCode(201)
  @Post('sign-up')
  signUp(@Body() singUpAuthDto: SingUpAuthDto) {
    return this.authService.singUp(singUpAuthDto);
  }

  @Post('sign-out')
  signOut(@Request() request) {
    return this.authService.singOut(request['user']);
  }

  @HttpCode(200)
  @Get('refresh')
  refreshToken(@Request() request) {
    return this.authService.refreshToken(request['user']);
  }
}
