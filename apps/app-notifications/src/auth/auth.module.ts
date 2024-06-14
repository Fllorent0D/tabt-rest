import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { BasicStrategy } from './auth-basic.strategy';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [PassportModule, CommonModule],
  providers: [AuthService, BasicStrategy],
})
export class AuthModule {}
