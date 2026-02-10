# Exercise: Understanding What to Change with AI (JavaScript)

This folder contains the **JavaScript** refactoring example for the “Understanding What to Change” exercise: **Code Duplication** — consolidating repeated patterns with a helper.

You do **not** need runnable code or tests for this exercise; use it to compare solutions and document learnings.

## Structure

| Folder | Content |
|--------|--------|
| **exercise3-javascript/** | Code Duplication: `calculateUserStatistics` consolidated with `statsForField` (plus alternative using reduce). |
| **REFLECTION.md** | Answers to the reflection questions and learnings. |

## Files

- **\*_ORIGINAL.js** — Code as given (repeated loops for average/max per field).
- **\*_IMPROVED.js** — Refactored with `statsForField(userData, fieldName)`.
- **\*_IMPROVED_ALTERNATIVE.js** — Same idea with `reduce` and `Math.max`.
- **README.md** (in exercise3-javascript) — What was identified and changed.

## How to use

1. Open the original and improved files side by side and compare.
2. Read the exercise’s README for the analysis.
3. Read **REFLECTION.md** for the reflection questions and takeaways.
4. Use your AI assistant with the course “Code Duplication” prompt and compare output.

## Prompt (from the course)

- **Code Duplication:** Ask the AI to find repeated patterns and suggest a consolidated approach (e.g. a helper that takes the field name).
