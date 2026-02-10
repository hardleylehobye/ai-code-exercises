# Strategy Pattern: Shipping Cost Calculator

## What changed

- **Before:** One function with nested `if/else` on `shippingMethod` and `destinationCountry`; adding a new method or country meant touching the same function and risk of regression.
- **After:** One strategy function per shipping method (`standardStrategy`, `expressStrategy`, `overnightStrategy`). Rates live in a `RATES` table; the context (`calculateShippingCost`) only looks up the strategy and calls it. New method = new strategy + one entry in `strategies`; new country = new row in `RATES`.

## Benefits

- **Maintainability:** Change standard shipping rules only in `standardStrategy`; change USA rate only in `RATES.USA`.
- **Extensibility:** Add "two-day" by implementing `twoDayStrategy` and adding it to `strategies`; no edits to existing strategies.
- **Testability:** Each strategy can be unit tested with fixed `packageDetails` and `destinationCountry`; the context is a thin dispatcher.
- **Readability:** The main function no longer branches on method/country; it delegates to the selected strategy.

## Future changes made easier

- New shipping method (e.g. "two-day"): add a strategy and register it.
- New destination (e.g. "EU"): add to `RATES` (or `getRegion`).
- New surcharge rule (e.g. fuel fee): add to the relevant strategy or a shared helper.
- A/B test or feature-flag a new pricing algorithm: swap the strategy at runtime.
