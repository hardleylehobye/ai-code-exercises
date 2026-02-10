# Exercise: Understanding What to Change with AI

This folder contains the **refactoring exercise** (Code Readability, Function Refactoring, Code Duplication) with original code, improved versions, and reflection.

You do **not** need runnable code or tests for this exercise—use it to compare solutions and document learnings to share with your group.

## Structure

| Folder | Content |
|--------|--------|
| **exercise1-java/** | Code Readability: `UserMgr` / `U` → `UserManager` / `User` with clear names and structure. |
| **exercise2-python/** | Function Refactoring: `process_orders` split into validation, pricing, and shipping helpers. |
| **exercise3-javascript/** | Code Duplication: `calculateUserStatistics` consolidated with `statsForField` (plus alternative). |
| **REFLECTION.md** | Answers to the reflection questions and learnings. |

## Files per exercise

- **\*_ORIGINAL.\*** — Code as given in the exercise.
- **\*_IMPROVED.\*** — Refactored version with brief comments.
- **README.md** — What was identified and changed (and why).

## How to use

1. Open the original and improved files side by side and compare.
2. Read each exercise’s README for the analysis.
3. Read **REFLECTION.md** for the reflection questions and takeaways.
4. Use your AI assistant with the course prompt templates and compare your AI’s output to these samples.
5. Share your own learnings and disagreements in the group discussion.

## Prompt templates (from the course)

- **Code Readability:** Ask the AI to improve variable names, method names, and structure using standard naming conventions for the language.
- **Function Refactoring:** Ask how to break a long function into smaller, focused functions and what each should do.
- **Code Duplication:** Ask to find repeated patterns and suggest a consolidated approach (e.g. helpers or parameters).
