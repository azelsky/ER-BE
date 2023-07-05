export interface IMonoCreateInvoice {
  invoiceId: string;
  pageUrl: string;
}

export interface IPaymentResponse {
  status: MonoPaymentStatus;
  restaurantPricingPlanId: string;
}

export interface IBuyPricingPlanResponse {
  paymentPageUrl: string;
}

export enum PricingPlanTypes {
  Trial = 'trial',
  Monthly = 'monthly',
  SemiAnnual = 'semi-annual',
  Annual = 'annual'
}

export enum MonoPaymentStatus {
  Created = 'created',
  Processing = 'processing',
  Hold = 'hold',
  Success = 'success',
  Failure = 'failure',
  Reversed = 'reversed',
  Expired = 'expired'
}
