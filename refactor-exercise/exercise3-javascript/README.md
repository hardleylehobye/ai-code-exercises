# Exercise 3: Code Duplication Detection (JavaScript)

## Repeated patterns in the original

1. **Average over a field:** Same loop for age, income, score — only the property name changes.
2. **Maximum over a field:** Same loop for age, income, score — only the property name changes.

## Consolidated approach (IMPROVED)

- **`statsForField(userData, fieldName)`** — one function that computes both average and highest for any numeric field in a single loop.
- **Main function** — calls `statsForField` three times for `'age'`, `'income'`, `'score'`.
- **Edge case:** Empty or missing `userData` returns zeroed stats instead of throwing.

## Alternative (IMPROVED_ALTERNATIVE)

- Uses `reduce` for sum and `Math.max(...array)` for max.
- Very compact; some teams find `reduce`/spread less obvious than a simple loop. Choose based on team style.

## Readability for junior developers

- **IMPROVED (loop + helper):** Easier to step through in a debugger and to explain (“we loop once per field and compute sum and max”).
- **IMPROVED_ALTERNATIVE:** Shorter but requires comfort with `reduce` and spread. Good if the team already uses this style.

Both versions remove the six duplicated loops and make adding a new field (e.g. `tenure`) trivial.
