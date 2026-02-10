# Adapter Pattern: Payment Gateways

## What changed

- **Before:** `PaymentService` knew both Stripe and PayPal APIs. It branched on `preferredGateway` and manually mapped our `CreditCardDetails` to each API’s shape (e.g. `cc_number`, `exp_month` for Stripe; `expiration` as "MM/YY" for PayPal). Refunds branched on transaction ID prefix. Adding a new gateway meant more branches and more mapping code in the same class.
- **After:** `PaymentProcessor` is our application’s interface. `StripeAdapter` and `PayPalAdapter` implement `PaymentProcessor` and wrap `StripeAPI` and `PayPalAPI` respectively; each adapter does the type and format conversion for that one gateway. `PaymentService` takes a `PaymentProcessor` in its constructor and delegates; it has no gateway-specific logic. To support a new gateway, add an adapter that implements `PaymentProcessor` and inject it.

## Benefits

- **Single responsibility:** Each adapter handles one external API; the service only orchestrates.
- **Open/closed:** New gateways = new adapter class; no changes to `PaymentService` or existing adapters.
- **Testability:** Mock `PaymentProcessor` in service tests; test each adapter against the real (or mocked) external API.
- **Consistent interface:** All gateways are used via `processPayment` / `refundPayment`; the rest of the app does not depend on Stripe or PayPal types.

## Future changes made easier

- New gateway (e.g. Square): implement `SquareAdapter` implementing `PaymentProcessor`; wire it in at startup.
- API upgrade (e.g. Stripe v2): change only `StripeAdapter` and possibly the wrapped `StripeAPI` client.
- Feature-flag or A/B test gateways: swap the injected `PaymentProcessor` (e.g. factory that returns Stripe or PayPal adapter based on config).
