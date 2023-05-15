import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AwsCognitoModule } from '../aws-cognito/aws-cognito.module';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [AuthController],
  imports: [AwsCognitoModule, UserModule]
})
export class AuthModule {}
