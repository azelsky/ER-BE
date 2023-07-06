import * as crypto from 'crypto';

import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  IBuyPricingPlanResponse,
  IMonoCreateInvoice,
  IPaymentResponse,
  PaymentStatuses
} from './pricing-plans.interfaces';

@Injectable()
export class MonobankPaymentService {
  private _api = this._configService.get('API_LINK');

  constructor(
    private readonly _httpService: HttpService,
    private readonly _configService: ConfigService
  ) {}

  public paymentResponse(request: Request): IPaymentResponse {
    const message = JSON.stringify(request.body);

    const xSignBase64 = request.headers['x-sign'];
    const pubKeyBase64 = this._configService.get('MONOBANK_PUB_KEY');

    const signatureBuf = Buffer.from(xSignBase64, 'base64');
    const publicKeyBuf = Buffer.from(pubKeyBase64, 'base64');

    const verify = crypto.createVerify('SHA256');

    verify.write(message);
    verify.end();

    const result = verify.verify(publicKeyBuf, signatureBuf);

    if (!result) {
      throw new HttpException('Signature verification failed', HttpStatus.UNAUTHORIZED);
    }

    return {
      status: request.body['status'] as PaymentStatuses,
      restaurantPricingPlanId: request.body['reference']
    };
  }

  public async buy(
    price: number,
    restaurantPricingPlanId: string
  ): Promise<IBuyPricingPlanResponse> {
    const xToken = this._configService.get('MONOBANK_X_TOKEN');
    const appLink = this._configService.get('APP_LINK');
    const handledPrice = price * 100;

    const response = await this._httpService
      .post<IMonoCreateInvoice>(
        'https://api.monobank.ua/api/merchant/invoice/create',
        {
          amount: handledPrice,
          ccy: 840,
          merchantPaymInfo: {
            reference: restaurantPricingPlanId
          },
          redirectUrl: appLink,
          webHookUrl: `${this._api}/restaurants/pricing-plans/payment-response`,
          validity: 3600
        },
        {
          headers: {
            'X-Token': xToken
          }
        }
      )
      .toPromise();

    return { paymentPageUrl: response.data.pageUrl };
  }
}
