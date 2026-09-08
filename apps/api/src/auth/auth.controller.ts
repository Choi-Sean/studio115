import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { AuthUserDto } from '@studio115/shared';
import { AuthService } from './auth.service';
import { LoginDto } from './auth.dto';
import { CurrentUser } from './current-user.decorator';
import { Public } from './public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto.email, dto.password);
  }

  @ApiBearerAuth()
  @Get('me')
  me(@CurrentUser() user: AuthUserDto) {
    return user;
  }
}
