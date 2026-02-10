# Reflection: Design Pattern Implementation Challenge (JavaScript)

## 1. How did implementing the pattern improve the code’s maintainability?

- **Strategy (shipping):** Pricing logic is split by shipping method. Changing standard rates or adding a dimensional rule only touches `standardStrategy`; adding a new method is a new function and one map entry. No more nested conditionals in one place. **One concern lives in one place**, so changes are local and easier to reason about.

## 2. What future changes will be easier because of this pattern?

- **Strategy:** New shipping method (e.g. “two-day”), new country, or new surcharge rule: add or edit one strategy and/or the rates table; no big if/else.

## 3. Were there any unexpected challenges in implementing the pattern?

- **Strategy:** Keeping the original behavior exactly (e.g. standard dimensional surcharge only when weight < 2 and volume > 1000) required implementing strategy functions that mirror the original rules. The pattern doesn’t simplify the rules themselves, only where they live. Behavior and edge cases still need to be designed and tested explicitly.
