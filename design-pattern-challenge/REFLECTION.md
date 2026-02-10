# Reflection: Design Pattern Implementation Challenge

## 1. How did implementing the pattern improve the code’s maintainability?

- **Strategy (shipping):** Pricing logic is split by shipping method. Changing standard rates or adding a dimensional rule only touches `standardStrategy`; adding a new method is a new function and one map entry. No more nested conditionals in one place.
- **Factory (database):** Each DB type has its own connection class. Changing MySQL connection string format only touches `MySQLConnection`; adding a new DB is a new class and one factory branch. The factory is the only place that knows “which type to create.”
- **Observer (weather):** The station no longer calls display methods by name. Adding or removing a display is registering/unregistering an observer. Display logic lives in observer classes, so changing one display doesn’t affect others or the subject.
- **Adapter (payment):** Gateway-specific mapping (our types → Stripe/PayPal) lives in adapters. `PaymentService` only talks to `PaymentProcessor`. Changing Stripe’s API or adding a new gateway is done in one adapter; the service and the rest of the app stay unchanged.

In all four cases, **one concern lives in one place**, so changes are local and easier to reason about.

## 2. What future changes will be easier because of this pattern?

- **Strategy:** New shipping method (e.g. “two-day”), new country, or new surcharge rule: add or edit one strategy and/or the rates table; no big if/else.
- **Factory:** New database type (e.g. SQLite): add a connection class and one factory entry; no changes to existing connection classes.
- **Observer:** New display (e.g. UV index, alerts): implement `WeatherObserver` and register it; optional feature flags or config-driven registration.
- **Adapter:** New payment provider (e.g. Square): implement `PaymentProcessor` in a `SquareAdapter` and inject it; no changes to `PaymentService` or other adapters. Upgrading one provider’s API only touches that adapter.

## 3. Were there any unexpected challenges in implementing the pattern?

- **Strategy:** Keeping the original behavior exactly (e.g. standard dimensional surcharge only when weight < 2 and volume > 1000) required implementing strategy functions that mirror the original rules. The pattern doesn’t simplify the rules themselves, only where they live.
- **Factory:** The original class had one big constructor with many optional parameters. The factory still needs to pass through all of them; the gain is in separating “which class” from “how that class connects,” not in reducing parameters.
- **Observer:** The original collected display strings and then printed them. We kept that by passing a shared `List<String>` into each observer’s `update`. An alternative is having observers return a string; the subject then decides whether to collect, log, or send elsewhere. Both are valid; we chose “collect then print” to preserve output order and behavior.
- **Adapter:** Refunds in the original were dispatched by transaction ID prefix (`stripe_tx_` vs `paypal_pmt_`). With adapters, the *caller* (or a small router) must choose which adapter to use for a refund, since the transaction ID is tied to a gateway. So we either inject one processor per “channel” or have a registry that picks adapter by ID prefix. The refactored version uses a single injected processor (one gateway per service instance); for multi-gateway refunds you’d add a thin router that selects the adapter by transaction ID.

Overall, the patterns improved structure and extensibility, but **behavior and edge cases** (e.g. dimensional rules, refund routing) still need to be designed and tested explicitly.
