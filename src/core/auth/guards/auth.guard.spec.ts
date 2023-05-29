import { Reflector } from '@nestjs/core';

import { AuthGuard } from './auth.guard';

describe('SkipAuthGuard', () => {
  it('should be defined', () => {
    expect(new AuthGuard(new Reflector())).toBeDefined();
  });
});
