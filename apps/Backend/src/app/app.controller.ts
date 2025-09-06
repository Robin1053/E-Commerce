import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard, Session, type UserSession } from '@thallesp/nestjs-better-auth';
import { UseGuards } from '@nestjs/common';

@Controller('users')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getData() {
    return this.appService.getData();
  }
}
@UseGuards(AuthGuard)
export class UserController {
  @Get('me')
  async getProfile(@Session() session: UserSession) {
    return { user: session.user };
  }
}