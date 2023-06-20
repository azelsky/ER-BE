import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TelegramGuard implements CanActivate {
  constructor(private readonly _configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const { token } = request.body;
    const telegramBotToken = this._configService.get('TELEGRAM_BOT_TOKEN');

    if (token !== telegramBotToken) {
      throw new ForbiddenException('Invalid token');
    }

    return true;
  }
}
