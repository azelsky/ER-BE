import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';

import { FROM } from '../email.constants';
import { ISendParams } from '../models/send-params.interface';
import { ISendResponse } from '../models/send-response.interface';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {
    SendGrid.setApiKey(this.configService.get<string>('SENDGRID_API_KEY'));
  }

  public async send(params: ISendParams): Promise<ISendResponse> {
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
