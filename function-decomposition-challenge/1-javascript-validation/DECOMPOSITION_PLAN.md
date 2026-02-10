# Decomposition Plan: validateUserData (JavaScript)

## Distinct responsibilities

| # | Responsibility | Current location in code | Suggested helper |
|---|----------------|---------------------------|------------------|
| 1 | Check required fields (registration vs profile) | Top-level if/for | `checkRequiredFields(userData, isRegistration)` |
| 2 | Validate username (length, charset, uniqueness) | Nested under isRegistration | `validateUsername(username, checkExisting)` |
| 3 | Validate password (length, complexity, confirmation) | Nested under isRegistration | `validatePassword(password, confirmPassword)` |
| 4 | Validate email (format, uniqueness) | Separate block | `validateEmail(email, isRegistration, checkExisting)` |
| 5 | Validate date of birth (valid date, age range) | Separate block | `validateDateOfBirth(dateOfBirth)` |
| 6 | Validate address (structure, required fields, zip by country) | Separate block | `validateAddress(address)` |
| 7 | Validate phone format | Separate block | `validatePhone(phone)` |
| 8 | Run custom validations | End block | Keep inline or `runCustomValidations(userData, options)` |

## Decomposition strategy

1. **Extract by domain:** One helper per “thing” (username, password, email, DOB, address, phone).
2. **Each helper returns errors for that domain:** Either append to a shared `errors` array (passed by reference) or return an array of strings; main function concatenates.
3. **Options passed only where needed:** e.g. `checkExisting` only to `validateUsername` and `validateEmail`.
4. **Main function becomes a pipeline:** required fields → username → password → email → DOB → address → phone → custom.

## Benefits

- **Readability:** Main function reads as a checklist; each helper is testable in isolation.
- **Reuse:** `validateEmail`, `validatePhone`, `validateAddress` usable in other flows (login, checkout).
- **Maintainability:** Change password rules in one place; add new fields without touching others.
- **Testability:** Unit test each validator with minimal fixtures.
