# Exercise 2: Function Refactoring (Python)

## Refactoring approach

| Strategy | What changed |
|----------|----------------|
| **Extract validation** | `validate_order()` returns an error dict or `None`; one place for all order validation. |
| **Extract pricing** | `calculate_line_price()`, `apply_premium_discount()`, `calculate_shipping()` each do one thing. |
| **Single loop responsibility** | Main loop: validate → compute amounts → update inventory → append result. No inline business rules. |
| **Derive total** | `total_revenue = sum(r['final_price'] for r in results)` instead of mutating a counter. |

## Benefits

- **Testability:** Each helper can be unit tested with simple inputs.
- **Readability:** `process_orders` reads like a high-level workflow.
- **Reuse:** Shipping, discount, and line price logic can be used elsewhere.
- **Easier changes:** Tax rate or shipping rules change in one function.

## Possible further improvements

- Constants: `TAX_RATE = 0.08`, `DOMESTIC_SHIPPING_THRESHOLD = 50`, etc.
- Typing: `def validate_order(order: dict, inventory: dict, ...) -> Optional[dict]:`
- Return a small result object/dataclass instead of nested dicts.
