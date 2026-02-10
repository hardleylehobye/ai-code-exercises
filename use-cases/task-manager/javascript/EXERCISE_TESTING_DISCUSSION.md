# Exercise: Using AI to Help with Testing — Discussion & Deliverables

This document summarizes the deliverables for the testing exercise and a short reflection.

---

## Deliverables

### Part 1: Understanding What to Test

- **Exercise 1.1 – Behavior analysis:** See **TEST_PLAN.md** → “Part 1.1: Behavior Analysis – Test Cases for `calculateTaskScore`”. It lists 9 test cases (priority, unknown priority, due date tiers, status penalties, tag boost, recent update, minimum score, no due date, combined factors).
- **Exercise 1.2 – Test planning:** See **TEST_PLAN.md** → “Part 1.2: Structured Test Plan”. It includes:
  - Priority of test cases (P0/P1/P2)
  - Types of tests (unit vs integration) per function
  - Test dependencies (no storage, plain task objects)
  - Expected outcomes and a checklist of tests to write

### Part 2: Improving a Single Test

- **Exercise 2.1 – First test and improved test:** See **tests/calculateTaskScore.test.js**:
  - “Basic functionality” describe block: one simple test (medium-priority todo returns 20).
  - “Priority base score (behavior)” describe block: improved tests with minimal task objects, one assertion per behavior, and explicit expected values (LOW=10, MEDIUM=20, HIGH=40, URGENT=60, unknown=0).
- **Exercise 2.2 – Due date tests:** Same file, “Due date calculation” describe block: overdue (+35), due today (+20), due in 1–2 days (+15), due in 3–7 days (+10), due later (+0), and no `dueDate` (no bonus). Uses relative dates (`daysFromNow`) so tests don’t depend on a fixed calendar.

### Part 3: Test-Driven Development

- **Exercise 3.1 – TDD for new feature (“assigned to current user” +12):**
  - **Tests:** **tests/tdd.test.js** — “TDD: assigned to current user gets +12 score boost”. Tests: (1) task assigned to current user gets +12 when `currentUserId` is passed; (2) no boost when assigned to someone else; (3) no boost when `assignedTo` is missing.
  - **Implementation:** **app.js** — `calculateTaskScore(task, currentUserId = null)`; when `currentUserId` is set and `task.assignedTo === currentUserId`, add 12 to the score. `sortTasksByImportance` and `getTopPriorityTasks` accept an optional `currentUserId` and pass it into `calculateTaskScore`.
- **Exercise 3.2 – TDD for “days since update” bug:**
  - **Tests:** **tests/tdd.test.js** — “TDD: days since update calculation (regression)”. Tests: (1) no boost when updated more than 1 full day ago; (2) +5 when updated less than 1 day ago; (3) no boost when updated exactly 1 day ago (boundary). The current implementation already uses the correct day conversion `(now - updatedAt) / (1000*60*60*24)`, so these tests document the correct behavior and guard against regressions (e.g. using raw milliseconds or wrong divisor).

### Part 4: Integration Testing

- **Exercise 4.1 – Full workflow:** See **tests/integration.test.js**. It verifies:
  - `sortTasksByImportance` returns a new array in descending score order (no mutation).
  - `getTopPriorityTasks` returns at most `limit` items in that order; limit 0 → empty; limit &gt; length → all tasks.
  - End-to-end: a small set of tasks (different priorities, due dates, statuses, tags) is sorted and top-N is taken; order matches expectations.
  - With `currentUserId`: a task assigned to the current user outranks an otherwise equal task assigned to someone else.

---

## Reflection: What I Learned About Testing

1. **Behavior vs implementation:** Focusing tests on *observable behavior* (inputs → score, order, top-N) instead of internal steps makes tests more stable and meaningful. The “improved” tests in Part 2 use minimal task objects and one clear assertion per behavior.
2. **Edge cases and boundaries:** Explicit tests for “no due date”, “unknown priority”, “exactly 1 day ago”, “limit 0”, and “limit &gt; length” make the contract of the API clear and prevent subtle bugs.
3. **TDD flow:** Writing the test first for the “assigned to me” feature made the desired API obvious (`currentUserId` as optional second argument) and ensured the implementation stayed minimal. For the “days since update” case, writing tests first clarified the intended rule (boost only when `daysSinceUpdate < 1`) and gave a regression suite.
4. **Integration tests:** Testing the three functions together with a single dataset showed that the pipeline (score → sort → slice) behaves as intended and that optional parameters like `currentUserId` flow through correctly.
5. **Test data:** Using relative dates (e.g. “2 days ago”, “due in 5 days”) and minimal task objects keeps tests readable and independent of the current date and of storage/DB.

---

## How to Run the Tests

From the `use-cases/task-manager/javascript` directory:

```bash
npm test
```

This runs `node --test tests/`. If you see an `EPERM` or spawn error (e.g. in some Windows/sandbox environments), run the test files directly:

```bash
node --test tests/calculateTaskScore.test.js tests/tdd.test.js tests/integration.test.js
```

All tests use Node’s built-in `node:test` and `node:assert`; no extra test framework is required.
