# Task Manager – Testing Exercise

Tests for the task prioritization algorithm: `calculateTaskScore`, `sortTasksByImportance`, and `getTopPriorityTasks`.

## Structure

| File | Content |
|------|--------|
| **calculateTaskScore.test.js** | Part 2: Unit tests (basic, improved, due date, status, tags, recency, minimum score) |
| **tdd.test.js** | Part 3: TDD tests (assigned-to-current-user +12, days-since-update regression) |
| **integration.test.js** | Part 4: Full workflow (sort order, getTopPriorityTasks, end-to-end with and without currentUser) |

## Run tests

```bash
npm test
```

Uses Node’s built-in test runner (`node --test`). No extra dependencies.

If you get a spawn/EPERM error (e.g. on Windows in a restricted environment), run:

```bash
node --test tests/calculateTaskScore.test.js tests/tdd.test.js tests/integration.test.js
```

## Related docs

- **TEST_PLAN.md** – Part 1: test cases and structured test plan
- **EXERCISE_TESTING_DISCUSSION.md** – Deliverables summary and reflection
