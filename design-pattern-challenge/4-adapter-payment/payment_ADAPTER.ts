/**
 * Payment processing with Adapter pattern.
 * StripeAdapter and PayPalAdapter adapt external APIs to our PaymentProcessor interface.
 */

// Our application's contract
export interface PaymentProcessor {
  processPayment(amount: number, cardDetails: CreditCardDetails): Promise<PaymentResult>;
  refundPayment(transactionId: string, amount: number): Promise<RefundResult>;
}

export interface CreditCardDetails {
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  cardholderName: string;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  errorMessage?: string;
}

export interface RefundResult {
  success: boolean;
  refundId?: string;
  errorMessage?: string;
}

// --- External Stripe-like API (incompatible interface) ---
export class StripeAPI {
  async createCharge(
    amountInCents: number,
    source: { cc_number: string; exp_month: number; exp_year: number; cvc: string; name: string },
    currency: string = 'usd'
  ): Promise<{ id: string; status: string; error?: { message: string } }> {
    if (source.cc_number === '4111111111111111') {
      return { id: `stripe_tx_${Date.now()}`, status: 'succeeded' };
    }
    return { id: '', status: 'failed', error: { message: 'Invalid card number' } };
  }

  async createRefund(chargeId: string, amountInCents: number): Promise<{ id: string; status: string; error?: { message: string } }> {
    if (chargeId.startsWith('stripe_tx_')) {
      return { id: `stripe_re_${Date.now()}`, status: 'succeeded' };
    }
    return { id: '', status: 'failed', error: { message: 'Invalid charge ID' } };
  }
}

// --- External PayPal-like API (incompatible interface) ---
export class PayPalAPI {
  async submitPayment(payment: {
    amount: number;
    card: { number: string; expiration: string; securityCode: string; holder: string };
  }): Promise<{ paymentId: string; successful: boolean; failureReason?: string }> {
    if (payment.card.number === '4111111111111111') {
      return { paymentId: `paypal_pmt_${Date.now()}`, successful: true };
    }
    return { paymentId: '', successful: false, failureReason: 'Card declined' };
  }

  async refund(paymentId: string, refundAmount: number): Promise<{ refundId: string; successful: boolean; failureReason?: string }> {
    if (paymentId.startsWith('paypal_pmt_')) {
      return { refundId: `paypal_ref_${Date.now()}`, successful: true };
    }
    return { refundId: '', successful: false, failureReason: 'Payment not found' };
  }
}

// --- Adapters: translate our interface to external APIs ---
export class StripeAdapter implements PaymentProcessor {
  constructor(private stripe: StripeAPI) {}

  async processPayment(amount: number, cardDetails: CreditCardDetails): Promise<PaymentResult> {
    const result = await this.stripe.createCharge(
      amount * 100,
      {
        cc_number: cardDetails.cardNumber,
        exp_month: cardDetails.expiryMonth,
        exp_year: cardDetails.expiryYear,
        cvc: cardDetails.cvv,
        name: cardDetails.cardholderName
      }
    );
    if (result.status === 'succeeded') {
      return { success: true, transactionId: result.id };
    }
    return { success: false, errorMessage: result.error?.message || 'Unknown error' };
  }

  async refundPayment(transactionId: string, amount: number): Promise<RefundResult> {
    const result = await this.stripe.createRefund(transactionId, amount * 100);
    if (result.status === 'succeeded') {
      return { success: true, refundId: result.id };
    }
    return { success: false, errorMessage: result.error?.message || 'Unknown error' };
  }
}

export class PayPalAdapter implements PaymentProcessor {
  constructor(private paypal: PayPalAPI) {}

  async processPayment(amount: number, cardDetails: CreditCardDetails): Promise<PaymentResult> {
    const expiration = `${String(cardDetails.expiryMonth).padStart(2, '0')}/${String(cardDetails.expiryYear).slice(-2)}`;
    const result = await this.paypal.submitPayment({
      amount,
      card: {
        number: cardDetails.cardNumber,
        expiration,
        securityCode: cardDetails.cvv,
        holder: cardDetails.cardholderName
      }
    });
    if (result.successful) {
      return { success: true, transactionId: result.paymentId };
    }
    return { success: false, errorMessage: result.failureReason || 'Unknown error' };
  }

  async refundPayment(transactionId: string, amount: number): Promise<RefundResult> {
    const result = await this.paypal.refund(transactionId, amount);
    if (result.successful) {
      return { success: true, refundId: result.refundId };
    }
    return { success: false, errorMessage: result.failureReason || 'Unknown error' };
  }
}

// --- Service uses only PaymentProcessor; gateway is injected ---
export class PaymentService {
  constructor(private processor: PaymentProcessor) {}

  async processPayment(amount: number, cardDetails: CreditCardDetails): Promise<PaymentResult> {
    try {
      return await this.processor.processPayment(amount, cardDetails);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, errorMessage: `Payment processing error: ${message}` };
    }
  }

  async refundPayment(transactionId: string, amount: number): Promise<RefundResult> {
    try {
      return await this.processor.refundPayment(transactionId, amount);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { success: false, errorMessage: `Refund processing error: ${message}` };
    }
  }
}
