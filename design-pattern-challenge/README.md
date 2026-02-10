# Exercise: Design Pattern Implementation Challenge

This folder contains refactored implementations for the four design pattern opportunities from the course, with tests (where applicable) and short notes.

## Pattern opportunities

| Folder | Pattern | Sample code | What’s included |
|--------|--------|-------------|-----------------|
| **1-strategy-shipping** | Strategy | Shipping cost calculator (method × country conditionals) | Original, Strategy refactor, Node tests, PATTERN_NOTES |
| **2-factory-database** | Factory | Database connection (one class, db_type branching) | Original, Factory refactor (create_connection + per-DB classes), unittest tests, PATTERN_NOTES |
| **3-observer-weather** | Observer | Weather station (multiple displays updated on change) | Original, Observer refactor (WeatherObserver + display classes), PATTERN_NOTES |
| **4-adapter-payment** | TypeScript | Payment gateways (Stripe/PayPal incompatible APIs) | Adapter refactor (StripeAdapter, PayPalAdapter, PaymentService), example_usage, PATTERN_NOTES |

## Instructions (from the course)

1. Select one of the pattern opportunities (or your own code).
2. Use AI to: analyze for pattern opportunities → get implementation guidance → refactor to implement the pattern.
3. Write tests to verify the refactored code preserves the original behavior.
4. Document the benefits of the pattern.
5. Answer the reflection questions (see **REFLECTION.md**).

## How to run

- **1-strategy-shipping:**  
  `cd 1-strategy-shipping && node --test shipping.test.js`
- **2-factory-database:**  
  `cd 2-factory-database && python -m pytest test_database.py` or `python -m unittest test_database`
- **3-observer-weather:**  
  `cd 3-observer-weather && javac WeatherStation_OBSERVER.java && java WeatherStation` (add a small `main` in WeatherStation if needed).
- **4-adapter-payment:**  
  Compile with `tsc` (or use ts-node); run `example_usage.ts` or your own script that wires adapters and calls `PaymentService`.

## Reflection

See **REFLECTION.md** for:

- How each pattern improved maintainability
- What future changes are easier
- Unexpected challenges (behavior preservation, refund routing, etc.)
