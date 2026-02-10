# Exercise: Function Decomposition Challenge

This folder contains decomposition plans, refactored code, and notes for the **Function Decomposition Challenge** (Using AI to refactor and enhance code).

## Instructions (from the course)

1. Select a complex function from your codebase or one of the sample functions below.
2. Use AI prompts to: identify responsibilities → create a decomposition plan → extract helpers with clear names → refactor the main function to call them.
3. Run tests to verify behavior is preserved.
4. Document your refactoring approach and benefits.
5. Answer the reflection questions.

## Contents

| Folder | Sample function | What’s included |
|--------|-----------------|------------------|
| **1-javascript-validation** | Data Validation (nested conditionals) | DECOMPOSITION_PLAN, original + refactored `validateUserData`, REFACTORING_NOTES |
| **2-python-report** | Report Generation (multiple transformations) | DECOMPOSITION_PLAN, refactored `generate_sales_report` with helpers, REFACTORING_NOTES |
| **3-java-pipeline** | Data Processing Pipeline (error handling) | DECOMPOSITION_PLAN, EXTRACTION_OUTLINE (main method structure + helper roles) |

## Sample functions (from the course)

1. **JavaScript:** `validateUserData(userData, options)` — registration vs profile validation, username, password, email, DOB, address, phone, custom validations.
2. **Python:** `generate_sales_report(sales_data, report_type, date_range, filters, grouping, include_charts, output_format)` — validate, filter, metrics, grouping, detailed/forecast, charts, output.
3. **Java:** `processCustomerData(rawData, source, options)` — load existing, preprocess by source, validate email/name/phone/address/DOB, dedupe, save, build result.

## How to use this repo

- **Compare:** Open original vs refactored side by side; see how the main function shrank and logic moved into named helpers.
- **Run tests:** Add or use existing tests for the original behavior; run them against the refactored code (see REFLECTION.md for testing notes).
- **Reflect:** Use **REFLECTION.md** for the reflection questions and to document your own learnings.
- **Starter code:** Check out the course GitLab repo for full originals and any provided tests.

## AI prompts (suggested)

- “Identify the distinct responsibilities in this function and list them.”
- “Create a decomposition plan: for each responsibility, suggest a helper function name and what it should take and return.”
- “Refactor the main function to call these helpers in order; preserve behavior.”
- “Which of these helpers would be most reusable elsewhere? Why?”
