import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { AwsCognitoService } from './services/aws-cognito.service';
import { JwtStrategy } from './services/jwt.strategy';

@Module({
  imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
  providers: [AwsCognitoService, JwtStrategy],
  exports: [AwsCognitoService]
})
export class AwsCognitoModule {}
