declare interface TPayment extends IBaseModel {
  orderId: string;
  amount: number;
  googlePayToken: any;
}

declare type TStripeCreateAccount = {
  country: string;
  email: string;
};

declare type TStripeCreateAccountResponse = {
  accountLink: any;
  accountId: string;
};

declare interface TPaymentRequest {
  apiVersion: number;
  apiVersionMinor: number;
  allowedPaymentMethods: [
    {
      type: string;
      parameters: {
        allowedAuthMethods: string[];
        allowedCardNetworks: string[];
      };
      tokenizationSpecification: {
        type: string;
        parameters: {
          gateway: string;
          gatewayMerchantId: string;
        };
      };
    },
  ];
  merchantInfo: {
    merchantId: string;
    merchantName: string;
  };
  transactionInfo: {
    totalPriceStatus: string;
    totalPrice: number;
    currencyCode: string;
    countryCode: string;
  };
}
