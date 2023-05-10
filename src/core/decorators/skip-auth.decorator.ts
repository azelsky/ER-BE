import { CustomDecorator, SetMetadata } from '@nestjs/common';

export const SkipAuthGuard = (): CustomDecorator<string> => SetMetadata('skipAuth', true);
