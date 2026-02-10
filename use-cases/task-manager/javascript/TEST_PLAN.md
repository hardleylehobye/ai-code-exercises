# Test Plan: Task Prioritization Algorithm

**Implementation:** JavaScript Task Manager  
**Functions under test:** `calculateTaskScore`, `sortTasksByImportance`, `getTopPriorityTasks`

---

## Part 1.1: Behavior Analysis – Test Cases for `calculateTaskScore`

Based on analyzing the function’s behavior and edge cases, here are the test cases to implement:

| # | Test case | Behavior / edge case | Expected outcome |
|---|-----------|----------------------|------------------|
| 1 | **Priority base score** | Task with each priority (LOW, MEDIUM, HIGH, URGENT) gets correct base score (×10) | LOW=10, MEDIUM=20, HIGH=40, URGENT=60 |
| 2 | **Unknown/invalid priority** | Task with missing or invalid `priority` | Treated as 0 (score 0 from priority) |
| 3 | **Due date tiers** | Overdue, due today, due in 1–2 days, due in 3–7 days, due later, no due date | +35, +20, +15, +10, +0, +0 respectively |
| 4 | **Status penalties** | DONE vs REVIEW vs other statuses | −50 for DONE, −15 for REVIEW, 0 for others |
| 5 | **Tag boost** | Tags contain "blocker", "critical", or "urgent" (case-sensitive) | +8 when any of these tags present |
| 6 | **Recently updated** | `updatedAt` within last calendar day | +5; no boost if older |
| 7 | **Minimum score** | Combination that would be negative (e.g. LOW + DONE) | Result is `Math.max(0, score)` |
| 8 | **No due date** | Task has no `dueDate` | No due-date bonus added |
| 9 | **Combined factors** | Multiple factors (e.g. HIGH + overdue + critical tag + recent update) | Score is sum of all applicable components, then floored at 0 |

---

## Part 1.2: Structured Test Plan (All Three Functions)

### Priority of test cases

1. **P0 – Core correctness**
   - `calculateTaskScore`: priority weights, due date tiers, status penalties, minimum 0.
   - `sortTasksByImportance`: order is descending by score; equal scores stable or acceptable.
   - `getTopPriorityTasks`: returns at most `limit` tasks; order matches sorted list.

2. **P1 – Edge cases**
   - Missing/optional fields: no `dueDate`, no `updatedAt`, no `tags`, invalid priority.
   - Empty input: `sortTasksByImportance([])`, `getTopPriorityTasks([], n)`.
   - Limit: `getTopPriorityTasks(tasks, 0)`, limit &gt; array length.

3. **P2 – Integration**
   - Full workflow: given a fixed set of tasks, order and top-N match expectations.

### Types of tests

| Function | Unit tests | Integration |
|----------|------------|-------------|
| `calculateTaskScore` | Yes – pure function, one task at a time | Used inside sort/top |
| `sortTasksByImportance` | Yes – input/output order | Yes – with real score logic |
| `getTopPriorityTasks` | Yes – slice of sorted list | Yes – full workflow |

### Test dependencies

- **Unit:** No shared state. Use plain task-like objects; no `TaskStorage` or file I/O.
- **Integration:** Same task objects passed through all three functions; no storage.

### Expected outcomes (summary)

- **calculateTaskScore:** Returns a non‑negative number; higher for higher priority, sooner due, blocker/critical/urgent tags, and recently updated; lower for DONE/REVIEW.
- **sortTasksByImportance:** New array (original unchanged), sorted descending by `calculateTaskScore`.
- **getTopPriorityTasks:** New array, first `limit` elements of that sorted order; default `limit` 5.

---

## Checklist of tests to write

- [ ] `calculateTaskScore`: priority only (each level)
- [ ] `calculateTaskScore`: due date (overdue, today, 1–2 days, 3–7 days, none)
- [ ] `calculateTaskScore`: status (DONE, REVIEW, TODO)
- [ ] `calculateTaskScore`: tags (blocker/critical/urgent vs others)
- [ ] `calculateTaskScore`: recent update (within 1 day vs not)
- [ ] `calculateTaskScore`: minimum 0 (negative would be clamped)
- [ ] `calculateTaskScore`: combined factors
- [ ] `sortTasksByImportance`: order descending by score; does not mutate input
- [ ] `getTopPriorityTasks`: returns at most `limit`; default limit 5; empty list
- [ ] Integration: full workflow with fixed task set and assertions on order and top-N
