# AI Use Cases – Exercise Checklist (JavaScript)

Use this checklist to confirm you’ve covered all **JavaScript** exercises from the course. After signing in on the LMS, compare with the official exercise list and tick off what you’ve done.

---

## 1. Using AI to help with testing

| Exercise | Description | Where it lives in this repo | Status |
|----------|-------------|----------------------------|--------|
| **Part 1.1** | Behavior analysis (what to test for `calculateTaskScore`) | `use-cases/task-manager/javascript/TEST_PLAN.md` (test cases list) | Done |
| **Part 1.2** | Test planning (all three functions, priorities, types) | `use-cases/task-manager/javascript/TEST_PLAN.md` (structured plan) | Done |
| **Part 2.1** | First test + improved test for `calculateTaskScore` | `use-cases/task-manager/javascript/tests/calculateTaskScore.test.js` | Done |
| **Part 2.2** | Due date calculation tests | Same file, “due date calculation” describe block | Done |
| **Part 3.1** | TDD: “assigned to current user” +12 boost | `use-cases/task-manager/javascript/tests/tdd.test.js` + `app.js` (currentUserId, assignedTo) | Done |
| **Part 3.2** | TDD: “days since update” bug/regression | `use-cases/task-manager/javascript/tests/tdd.test.js` | Done |
| **Part 4.1** | Integration test (full workflow) | `use-cases/task-manager/javascript/tests/integration.test.js` | Done |
| **Discussion** | Test plan + improved tests + TDD + integration + reflection | `use-cases/task-manager/javascript/EXERCISE_TESTING_DISCUSSION.md` | Done |

**Run tests:** `cd use-cases/task-manager/javascript && npm test`

---

## 2. Using AI to refactor and enhance code (JavaScript)

### 2a. Exercise: Understanding What to Change with AI

| Exercise | Description | Where it lives | Status |
|----------|-------------|----------------|--------|
| **Code duplication** | JavaScript: `calculateUserStatistics` → `statsForField` | `refactor-exercise/exercise3-javascript/` (ORIGINAL, IMPROVED, README) | Done |
| **Reflection** | Prompting strategies, safeguards, adapt prompts | `refactor-exercise/REFLECTION.md` | Done |

### 2b. Exercise: Function Decomposition Challenge

| Item | Description | Where it lives | Status |
|------|-------------|----------------|--------|
| **Sample** | Data validation: `validateUserData` (nested conditionals) | `function-decomposition-challenge/1-javascript-validation/` (plan, original, refactored, notes) | Done |
| **Reflection** | Readability, challenges, reuse | `function-decomposition-challenge/REFLECTION.md` | Done |

### 2c. Exercise: Code Readability Challenge

| Item | Description | Where it lives | Status |
|------|-------------|----------------|--------|
| **Challenge** | Apply readability prompts; document learnings | `code-readability-challenge/README.md` (checklist + link to JS examples) | Done |
| **Reference** | JS duplication + validation examples | `refactor-exercise/exercise3-javascript/`, `function-decomposition-challenge/1-javascript-validation/` | Done |

### 2d. Exercise: Design Pattern Implementation Challenge

| Pattern | Sample code | Where it lives | Status |
|---------|-------------|----------------|--------|
| **Strategy** | Shipping cost calculator (JavaScript) | `design-pattern-challenge/1-strategy-shipping/` (original, strategy refactor, tests, notes) | Done |
| **Reflection** | Maintainability, future changes, challenges | `design-pattern-challenge/REFLECTION.md` | Done |

**Run Strategy tests:** `cd design-pattern-challenge/1-strategy-shipping && node --test shipping.test.js`

### 2e. Assessment: Using AI to refactor and enhance code

| Item | What to do | Status |
|------|------------|--------|
| **Assessment** | Complete on LMS when available | To do on LMS |

---

## Quick summary

- **Testing:** `use-cases/task-manager/javascript/` — test plan, unit tests, TDD, integration, discussion.
- **Understanding What to Change:** `refactor-exercise/exercise3-javascript/` — code duplication (JS) + reflection.
- **Function Decomposition:** `function-decomposition-challenge/1-javascript-validation/` — validateUserData + reflection.
- **Code Readability:** `code-readability-challenge/` + JS examples in refactor and decomposition folders.
- **Design Pattern:** `design-pattern-challenge/1-strategy-shipping/` — Strategy pattern (JS) + reflection.
- **Assessment:** To be completed on the LMS.

After signing in at the course exercises page, compare the listed exercises with this checklist and complete any additional items (e.g. submission, assessment).
