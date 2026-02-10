// Example: wire Stripe or PayPal via adapter; PaymentService stays unchanged
import {
  PaymentService,
  StripeAPI,
  StripeAdapter,
  PayPalAPI,
  PayPalAdapter,
  CreditCardDetails
} from './payment_ADAPTER';

async function run() {
  const card: CreditCardDetails = {
    cardNumber: '4111111111111111',
    expiryMonth: 12,
    expiryYear: 2025,
    cvv: '123',
    cardholderName: 'John Doe'
  };

  // Use Stripe
  const stripeService = new PaymentService(new StripeAdapter(new StripeAPI()));
  const paymentResult = await stripeService.processPayment(99.99, card);
  console.log('Stripe payment:', paymentResult);

  if (paymentResult.success && paymentResult.transactionId) {
    const refundResult = await stripeService.refundPayment(paymentResult.transactionId, 99.99);
    console.log('Stripe refund:', refundResult);
  }

  // Use PayPal (same PaymentService, different adapter)
  const paypalService = new PaymentService(new PayPalAdapter(new PayPalAPI()));
  const paypalPayment = await paypalService.processPayment(50, card);
  console.log('PayPal payment:', paypalPayment);
}

run();
