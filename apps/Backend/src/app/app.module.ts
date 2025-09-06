import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from '../auth'; // Your Better Auth instance

@Module({
  imports: [AuthModule.forRoot(auth)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
