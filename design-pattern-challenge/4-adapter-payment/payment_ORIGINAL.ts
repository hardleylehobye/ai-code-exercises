// Original: PaymentService branches on gateway and maps types manually - Adapter candidate
// (Abbreviated; see course materials for full StripeAPI/PayPalAPI.)

interface PaymentProcessor {
  processPayment(amount: number, cardDetails: CreditCardDetails): Promise<PaymentResult>;
  refundPayment(transactionId: string, amount: number): Promise<RefundResult>;
}

interface CreditCardDetails {
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  cardholderName: string;
}

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  errorMessage?: string;
}

interface RefundResult {
  success: boolean;
  refundId?: string;
  errorMessage?: string;
}

// PaymentService without adapters: knows Stripe/PayPal APIs and maps our types to theirs.
// Refactor: introduce StripeAdapter and PayPalAdapter that implement PaymentProcessor.
