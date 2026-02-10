# AI Use Cases – Exercise Checklist

Use this checklist to confirm you’ve covered all exercises from the course (e.g. [WTC LMS – AI Use Cases / Exercises](https://ai.wethinkco.de/ai-software/ai-use-cases/exercises)). After signing in on the LMS, compare this list with the official exercise list and tick off what you’ve done.

---

## 1. Using AI to help with testing

| Exercise | Description | Where it lives in this repo | Status |
|----------|-------------|----------------------------|--------|
| **Part 1.1** | Behavior analysis (what to test for `calculateTaskScore`) | `use-cases/task-manager/javascript/TEST_PLAN.md` (test cases list) | Done |
| **Part 1.2** | Test planning (all three functions, priorities, types) | `use-cases/task-manager/javascript/TEST_PLAN.md` (structured plan) | Done |
| **Part 2.1** | First test + improved test for `calculateTaskScore` | `use-cases/task-manager/javascript/tests/calculateTaskScore.test.js` | Done |
| **Part 2.2** | Due date calculation tests | Same file, “due date calculation” describe block | Done |
| **Part 3.1** | TDD: “assigned to current user” +12 boost | `tests/tdd.test.js` + `app.js` (currentUserId, assignedTo) | Done |
| **Part 3.2** | TDD: “days since update” bug/regression | `tests/tdd.test.js` (days-since-update tests) | Done |
| **Part 4.1** | Integration test (full workflow) | `use-cases/task-manager/javascript/tests/integration.test.js` | Done |
| **Discussion** | Test plan + improved tests + TDD + integration + reflection | `use-cases/task-manager/javascript/EXERCISE_TESTING_DISCUSSION.md` | Done |

**Run tests:** `cd use-cases/task-manager/javascript && npm test`

---

## 2. Using AI to refactor and enhance code

### 2a. Exercise: Understanding What to Change with AI

| Exercise | Description | Where it lives | Status |
|----------|-------------|----------------|--------|
| **Exercise 1** | Code readability (Java: UserMgr / U) | `refactor-exercise/exercise1-java/` (ORIGINAL, IMPROVED, README) | Done |
| **Exercise 2** | Function refactoring (Python: process_orders) | `refactor-exercise/exercise2-python/` (ORIGINAL, IMPROVED, README) | Done |
| **Exercise 3** | Code duplication (JavaScript: calculateUserStatistics) | `refactor-exercise/exercise3-javascript/` (ORIGINAL, IMPROVED, README) | Done |
| **Reflection** | Prompting strategies, safeguards, adapt prompts | `refactor-exercise/REFLECTION.md` | Done |

### 2b. Exercise: Function Decomposition Challenge

| Item | Description | Where it lives | Status |
|------|-------------|----------------|--------|
| **Sample 1** | Data validation (JS: validateUserData) | `function-decomposition-challenge/1-javascript-validation/` (plan, original, refactored, notes) | Done |
| **Sample 2** | Report generation (Python: generate_sales_report) | `function-decomposition-challenge/2-python-report/` (plan, refactored, notes) | Done |
| **Sample 3** | Data processing pipeline (Java: processCustomerData) | `function-decomposition-challenge/3-java-pipeline/` (plan, extraction outline) | Done |
| **Reflection** | Readability, challenges, reuse | `function-decomposition-challenge/REFLECTION.md` | Done |

### 2c. Exercise: Code Readability Challenge

| Item | Description | Where it lives | Status |
|------|-------------|----------------|--------|
| **Challenge** | Apply readability prompts; document learnings | `code-readability-challenge/README.md` (checklist + link to refactor-exercise) | Done |
| **Reference** | Java readability example | `refactor-exercise/exercise1-java/` | Done |

### 2d. Exercise: Design Pattern Implementation Challenge

| Pattern | Sample code | Where it lives | Status |
|---------|-------------|----------------|--------|
| **Strategy** | Shipping cost (JavaScript) | `design-pattern-challenge/1-strategy-shipping/` (original, strategy refactor, tests, notes) | Done |
| **Factory** | Database connections (Python) | `design-pattern-challenge/2-factory-database/` (original, factory refactor, tests, notes) | Done |
| **Observer** | Weather station (Java) | `design-pattern-challenge/3-observer-weather/` (original, observer refactor, notes) | Done |
| **Adapter** | Payment gateways (TypeScript) | `design-pattern-challenge/4-adapter-payment/` (adapter refactor, example, notes) | Done |
| **Reflection** | Maintainability, future changes, challenges | `design-pattern-challenge/REFLECTION.md` | Done |

**Run Strategy tests:** `cd design-pattern-challenge/1-strategy-shipping && node --test shipping.test.js`  
**Run Factory tests:** `cd design-pattern-challenge/2-factory-database && python -m unittest test_database`

### 2e. Assessment: Using AI to refactor and enhance code

| Item | What to do | Status |
|------|------------|--------|
| **Assessment** | Complete on LMS when available | To do on LMS |

---

## Quick summary

- **Testing exercise:** Fully implemented in `use-cases/task-manager/javascript/` (test plan, unit tests, TDD, integration, discussion).
- **Understanding What to Change:** All three (Java, Python, JS) in `refactor-exercise/` with reflection.
- **Function Decomposition:** All three samples in `function-decomposition-challenge/` with plans and reflection.
- **Code Readability Challenge:** Checklist and reference in `code-readability-challenge/` and `refactor-exercise/`.
- **Design Pattern Challenge:** All four patterns in `design-pattern-challenge/` with refactors, tests (Strategy + Factory), and reflection.
- **Assessment:** To be completed on the LMS.

After signing in at [https://ai.wethinkco.de/ai-software/ai-use-cases/exercises](https://ai.wethinkco.de/ai-software/ai-use-cases/exercises), compare the listed exercises with this checklist and tick off any additional items required by the course (e.g. submissions, quizzes, or extra tasks).
