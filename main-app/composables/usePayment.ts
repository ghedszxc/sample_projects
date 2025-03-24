const { useLocalFetchUtil } = useUtils();

export default function usePayment() {
  class MPayment implements TPayment {
    _id?: string;
    orderId: string;
    amount: number;
    googlePayToken: any;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    constructor(
      {
        _id = "",
        orderId = "",
        amount = 0,
        googlePayToken,
        createdAt,
        updatedAt,
      } = {} as TPayment,
    ) {
      this._id = _id;
      this.orderId = orderId;
      this.amount = amount;
      this.googlePayToken = googlePayToken;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  }

  const paymentApiUrl = "/api/payment/transaction";
  const stripeApiUrl = "/api/payment/stripe";
  const paymentPayload = useState("paymentPayload", () => new MPayment());

  async function initializeGooglePay() {
    try {
      await loadGooglePayScript();

      if (!window.google || !google.payments || !google.payments.api) {
        console.error("Google Pay library is not loaded.");
        return;
      }

      const paymentsClient = new google.payments.api.PaymentsClient({
        environment: "TEST", // Change to 'PRODUCTION' for live environments
      });

      const googlePayButton = paymentsClient.createButton({
        onClick: onGooglePayClicked,
      });

      const buttonContainer = document.getElementById("google-pay-button");
      if (buttonContainer) {
        buttonContainer.appendChild(googlePayButton);
      }
    } catch (error) {
      console.error("Error initializing Google Pay:", error);
    }
  }

  async function onGooglePayClicked() {
    try {
      const paymentRequest: google.payments.api.PaymentDataRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [
          {
            type: "CARD",
            parameters: {
              allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
              allowedCardNetworks: ["VISA", "MASTERCARD"],
            },
            tokenizationSpecification: {
              type: "PAYMENT_GATEWAY",
              parameters: {
                gateway: useRuntimeConfig().public.PAYMENT_GATEWAY,
                gatewayMerchantId:
                  useRuntimeConfig().public.PAYMENT_GATEWAY_MERCHANT_ID,
              },
            },
          },
        ],
        merchantInfo: {
          merchantId: useRuntimeConfig().public.MERCHANT_ID,
          merchantName: useRuntimeConfig().public.MERCHANT_NAME,
        },
        transactionInfo: {
          totalPriceStatus: "FINAL",
          totalPrice: "10.00",
          currencyCode: "USD",
          countryCode: "US",
        },
      };
      const token = await generateGooglePayToken(paymentRequest);
      const result = await processGooglePayToken(token);
      return result;
    } catch (error) {
      console.error(error);
    }
  }

  async function processGooglePayToken(token: any) {
    console.log("token : ", token);
    const response = await useLocalFetchUtil<{
      data: {
        acknowledged: boolean;
        insertedId: string;
      };
      message: string;
    }>(paymentApiUrl, "POST", token);
    return response;
  }

  async function loadGooglePayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (document.getElementById("google-pay-script")) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://pay.google.com/gp/p/js/pay.js";
      script.id = "google-pay-script";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Failed to load Google Pay script"));
      document.head.appendChild(script);
    });
  }

  async function generateGooglePayToken(payload: TPaymentRequest) {
    const paymentsClient = new google.payments.api.PaymentsClient({
      environment: useRuntimeConfig().public.GOOGLE_PAY_ENVIRONMENT,
    });

    const paymentData = await paymentsClient.loadPaymentData(payload);
    return paymentData.paymentMethodData.tokenizationData.token;
  }

  async function createStripeAccount(payload: TStripeCreateAccount) {
    return useNuxtApp().$api(stripeApiUrl, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }

  async function verifyStripeAccount(accountId: string) {
    return useNuxtApp().$api(`${stripeApiUrl}/${accountId}`, {
      method: "GET",
    }) as unknown as { account: any; isVerified: boolean };
  }

  return {
    initializeGooglePay,
    onGooglePayClicked,
    processGooglePayToken,
    loadGooglePayScript,
    generateGooglePayToken,
    createStripeAccount,
    verifyStripeAccount,
  };
}
