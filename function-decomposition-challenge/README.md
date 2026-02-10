# Exercise: Function Decomposition Challenge (JavaScript)

This folder contains the **JavaScript** sample for the Function Decomposition Challenge: breaking a large validation function into smaller helpers.

## Instructions (from the course)

1. Select a complex function (here: `validateUserData`).
2. Use AI prompts to: identify responsibilities → create a decomposition plan → extract helpers with clear names → refactor the main function to call them.
3. Run tests to verify behavior is preserved.
4. Document your refactoring approach and benefits.
5. Answer the reflection questions.

## Contents

| Folder | Sample function | What’s included |
|--------|-----------------|------------------|
| **1-javascript-validation** | `validateUserData(userData, options)` — registration/profile validation, username, password, email, DOB, address, phone, custom validations | DECOMPOSITION_PLAN, original + refactored code, REFACTORING_NOTES |

## How to use

- **Compare:** Open original vs refactored side by side; see how the main function became a pipeline of helpers.
- **Reflect:** Use **REFLECTION.md** for the reflection questions and your own learnings.
- **Test:** Add unit tests for the original behavior and run them against the refactored code.

## AI prompts (suggested)

- “Identify the distinct responsibilities in this function and list them.”
- “Create a decomposition plan: for each responsibility, suggest a helper function name and what it should take and return.”
- “Refactor the main function to call these helpers in order; preserve behavior.”
- “Which of these helpers would be most reusable elsewhere? Why?”
