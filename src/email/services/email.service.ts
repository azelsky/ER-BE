import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';

import { IStatusResponse } from '@shared/interfaces';

import { FROM } from '../email.constants';
import { ISendParams } from '../models/send-params.interface';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {
    SendGrid.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
  }

  public async send(params: ISendParams): Promise<IStatusResponse> {
    try {
      const mailData: SendGrid.MailDataRequired = {
        ...params,
        from: FROM
      };
      await SendGrid.send(mailData);
      return { success: true, message: 'Email sent successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to send email' };
    }
  }
}
