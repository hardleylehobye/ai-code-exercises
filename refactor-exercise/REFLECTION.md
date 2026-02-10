# Reflection: Understanding What to Change with AI

This document captures learnings from the refactoring exercise (Code Readability, Function Refactoring, Code Duplication) and answers the reflection questions.

---

## 1. Which prompting strategy did you find most useful? Why?

**Code Readability (Exercise 1)** was the most immediately useful. Asking the AI to “improve readability using standard Java naming conventions” led to:

- Systematic renaming (class, methods, variables) without changing behavior.
- Extraction of validation into a named method, which I might have left inline.
- A clear list of issues (abbreviations, single-letter names, magic logic) that is easy to reuse on other code.

**Why it stood out:** Readability improvements are low-risk and easy to review. The AI consistently applied language norms (e.g. Java full names, `findUserByUsername` instead of `f`), which is a good baseline for any codebase.

---

## 2. What kinds of improvements did the AI suggest that you might not have thought of?

- **Security:** Flagging SQL built from string concatenation and suggesting prepared statements (even if only as a TODO in the sample). It’s easy to focus on naming and miss injection risk.
- **Null safety:** Adding `username != null && ...` in validation. I might have assumed “caller passes valid args” and skipped explicit null checks.
- **Edge cases:** In the JavaScript example, handling empty or missing `userData` so the function doesn’t throw. Duplication reduction often focuses on the “happy path” and forgets empty input.
- **Single-pass option:** Suggesting one loop in `statsForField` that computes both sum and max, instead of two separate loops. I might have kept two loops for “clarity” and not considered the single-pass version.
- **Extract validation first:** In the Python refactor, pulling validation into a function that returns an error or `None` makes the main loop much easier to read and test; I might have extracted “calculate shipping” first and left validation inline.

---

## 3. Were there any suggestions the AI made that you disagreed with? Why?

- **Over-abstraction:** Sometimes the AI suggests extra layers (e.g. a “strategy” or many tiny helpers) when one or two well-named functions are enough. For the Python example, keeping a single `validate_order` and a few pricing helpers is enough; more abstraction can hurt readability.
- **Style preferences:** For the JavaScript duplication, one approach uses a simple loop in `statsForField`, another uses `reduce` and `Math.max(...array)`. I’d pick based on team style: the loop is often clearer for juniors; the functional version is fine for teams that use it everywhere.
- **Mutating inventory in place:** The refactored Python still does `inventory[item_id]['quantity'] -= quantity` inside the main flow. An AI might suggest returning “inventory updates” and applying them elsewhere. That’s a design choice (immutability vs. simplicity); for this exercise, keeping the mutation was acceptable and easier to compare to the original.

So: use AI suggestions as a checklist and adapt them to your team’s style and risk tolerance rather than applying every suggestion as-is.

---

## 4. How might you adapt these prompts for your specific codebase or tech stack?

- **Add context:** “This is [Java 17 / Python 3.11 / Node 20]. We use [Spring / Django / Express]. Follow our style guide: [link or short rules].”
- **Scope:** “Improve readability only in this class; don’t change the public API or add dependencies.”
- **Conventions:** “We name boolean methods with `is`/`has`/`can`. We don’t abbreviate in production code.”
- **Security and compliance:** “We must use parameterized queries for SQL and never log passwords.”
- **Duplication:** “We prefer a single helper that takes the field name (like `statsForField`) over separate functions per field, so we can add new fields without new functions.”

Keeping a small “prompt library” (readability, extract function, find duplication, add edge-case handling) and pasting the relevant one plus your code and context works well.

---

## 5. What safeguards would you put in place before applying AI-suggested refactoring to production code?

1. **Tests first:** Have passing unit/integration tests. Run them after each refactor; if something breaks, the refactor is at fault or the tests need updating.
2. **Small, reviewable changes:** Apply one exercise type per PR (e.g. readability only, or one extracted function). Makes review and rollback easier.
3. **Diff review:** Treat AI output as a proposal. Review every line; revert or adjust suggestions that change behavior or conflict with team norms.
4. **No behavior change (for pure refactors):** For readability and duplication, keep behavior identical. For “extract function,” ensure inputs/outputs and side effects match the original.
5. **Security and data flow:** Especially when touching DB, auth, or PII, double-check that the refactor doesn’t introduce injection, logging of secrets, or wrong permissions.
6. **Document decisions:** In the PR or a short doc, note what was refactored and why (e.g. “Renamed for Java conventions; extracted validation; no new dependencies”). Helps future readers and auditors.

---

## Summary table

| Exercise | Main takeaway |
|----------|----------------|
| **1 – Readability (Java)** | Consistent naming and extracted validation improve clarity and testability; AI is good at applying language conventions and spotting security issues like SQL concatenation. |
| **2 – Refactoring (Python)** | Break one big function into focused helpers (validate, price, shipping); keep the main function as a clear workflow; consider constants and types next. |
| **3 – Duplication (JavaScript)** | Replace repeated “average/max over field” loops with one parameterized helper (e.g. `statsForField`) or a small functional variant; choose style based on team readability. |

---

## Next steps (from the exercise)

- Try these prompts on real code from your projects.
- Build a personal template library (readability, extract function, duplication, add tests).
- Practice explaining refactoring decisions in code review or documentation.
- Always run tests before and after refactoring production code.
