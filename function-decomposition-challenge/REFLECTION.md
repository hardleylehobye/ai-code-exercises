# Reflection: Function Decomposition Challenge (JavaScript)

## 1. How did breaking down the function improve its readability and maintainability?

- **Readability:** The main function became a short pipeline of steps (required fields → username → password → email → DOB → address → phone → custom). You can understand *what* it does without reading every branch. Each helper name describes one responsibility (e.g. `validateUsername`, `validateEmail`, `validateAddress`).
- **Maintainability:** Changes are localized. To tighten password rules you edit `validatePassword` only. To add a new validation (e.g. phone) you add one helper and one line in the main flow. Less risk of breaking unrelated logic when editing.

## 2. What was the most challenging part of decomposing the function?

- **Shared state:** The validator passes an `errors` array through every helper so they can append. You have to decide: mutate a shared list vs return errors from each helper and concatenate in the main function. Both work; we chose “pass errors by reference” to avoid allocating many arrays.
- **Preserving behavior:** Extracting helpers without changing behavior required tracing the original logic step by step and keeping the same order and conditions (e.g. email empty vs invalid vs duplicate).

## 3. Which extracted function would be most reusable in other contexts?

- **JavaScript:** `validateEmail`, `validatePhone`, and `validateAddress` are the most reusable. They depend only on the value (and optionally a “check existing” callback). They can be used in login, profile edit, checkout, or any form that collects email/phone/address.

## 4. Document your refactoring approach and the benefits gained

- **Approach:** We (1) listed distinct responsibilities in a table, (2) gave each responsibility a helper name and a clear input/output or side effect, (3) refactored the main function to call those helpers in order, (4) moved logic into the helpers without changing behavior.
- **Benefits:** See DECOMPOSITION_PLAN and REFACTORING_NOTES in `1-javascript-validation/`: readability (main function as pipeline), testability (unit test each helper), reuse (validators usable elsewhere), maintainability (change one concern in one place).

## 5. Run tests to verify the refactoring preserves behavior

- Add unit tests for `validateUserData` with the same inputs as before; assert the same `errors` array. Add tests for each helper (e.g. `validateUsername` with too-short username, invalid chars, or existing username) to lock behavior.
- Always run the full test suite before and after refactoring; fix any failing test before considering the decomposition done.
