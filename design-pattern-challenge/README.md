# Exercise: Design Pattern Implementation Challenge (JavaScript)

This folder contains the **JavaScript** design pattern example: **Strategy pattern** for a shipping cost calculator.

## Pattern

| Folder | Pattern | Sample code | What’s included |
|--------|--------|-------------|-----------------|
| **1-strategy-shipping** | Strategy | Shipping cost calculator (method × country conditionals) | Original, Strategy refactor, Node tests, PATTERN_NOTES |

## Instructions (from the course)

1. Select a piece of code with conditional logic (here: shipping method × country).
2. Use AI to: analyze for pattern opportunities → get implementation guidance → refactor to implement the pattern.
3. Write tests to verify the refactored code preserves the original behavior.
4. Document the benefits of the pattern.
5. Answer the reflection questions (see **REFLECTION.md**).

## How to run

```bash
cd 1-strategy-shipping && node --test shipping.test.js
```

## Reflection

See **REFLECTION.md** for:

- How the pattern improved maintainability
- What future changes are easier
- Unexpected challenges (e.g. behavior preservation)
