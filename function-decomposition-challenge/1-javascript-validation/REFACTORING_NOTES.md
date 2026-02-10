# Refactoring Notes: validateUserData

## Approach

- **One helper per domain:** username, password, email, dateOfBirth, address, phone, required fields, custom validations.
- Helpers take the raw value(s) and an `errors` array; they push messages and return (no return value).
- Main function is a linear pipeline: no nested conditionals, easy to scan.

## Benefits

- **Readability:** `validateUserData` is ~15 lines; each helper has a single job.
- **Testability:** Each of `validateUsername`, `validatePassword`, `validateEmail`, etc. can be unit tested with minimal setup.
- **Reuse:** `validateEmail`, `validatePhone`, `validateAddress` are usable in other forms (e.g. checkout, contact).
- **Maintainability:** Password rules or zip patterns change in one place; adding a new field means one new helper and one line in the main function.

## Behavior preserved

- Same error messages and same order of checks as the original.
- Registration vs profile required-field logic unchanged; email/DOB/address/phone validation unchanged.
- Custom validations still run last.
