import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AwsCognitoModule } from '../aws-cognito/aws-cognito.module';
import { UsersModule } from '../user/users.module';

@Module({
  controllers: [AuthController],
  imports: [AwsCognitoModule, UsersModule]
})
export class AuthModule {}
