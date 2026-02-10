# Reflection: Understanding What to Change with AI (JavaScript)

This document captures learnings from the **JavaScript** refactoring exercise (Code Duplication) and answers the reflection questions.

---

## 1. Which prompting strategy did you find most useful? Why?

**Code Duplication** was very useful. Asking the AI to find repeated patterns and suggest a consolidated approach led to:

- A single helper `statsForField(userData, fieldName)` that computes both average and max for any numeric field.
- Handling empty or missing `userData` so the function doesn’t throw — duplication reduction often focuses on the “happy path” and forgets empty input.
- Two styles to choose from: a simple loop (clear for juniors) vs `reduce` and `Math.max` (functional style).

**Why it stood out:** One parameterized helper replaces six repeated loops; adding a new field (e.g. `tenure`) is one line. The AI made the “single-pass” option obvious (one loop for sum and max per field).

---

## 2. What kinds of improvements did the AI suggest that you might not have thought of?

- **Edge cases:** Handling empty or missing `userData` so the function doesn’t throw.
- **Single-pass option:** One loop in `statsForField` that computes both sum and max, instead of two separate loops.
- **Alternative style:** The `reduce` + `Math.max` version for teams that prefer functional style.

---

## 3. Were there any suggestions the AI made that you disagreed with? Why?

- **Style preferences:** One approach uses a simple loop in `statsForField`, another uses `reduce` and `Math.max(...array)`. I’d pick based on team style: the loop is often clearer for juniors; the functional version is fine for teams that use it everywhere. Use AI suggestions as a checklist and adapt to your team’s style.

---

## 4. How might you adapt these prompts for your specific codebase or tech stack?

- **Add context:** “This is Node 20. We use ESLint and prefer explicit loops over reduce for readability.”
- **Scope:** “Improve duplication only in this function; don’t change the return shape or add dependencies.”
- **Duplication:** “We prefer a single helper that takes the field name (like `statsForField`) over separate functions per field, so we can add new fields without new functions.”

Keeping a small “prompt library” (readability, extract function, find duplication, add edge-case handling) and pasting the relevant one plus your code works well.

---

## 5. What safeguards would you put in place before applying AI-suggested refactoring to production code?

1. **Tests first:** Have passing unit tests. Run them after the refactor; if something breaks, the refactor is at fault.
2. **Small, reviewable changes:** One refactor per PR (e.g. duplication only).
3. **Diff review:** Treat AI output as a proposal. Review every line; revert or adjust suggestions that change behavior.
4. **No behavior change:** For duplication, keep behavior identical (same return shape, same edge-case handling).
5. **Document decisions:** In the PR, note what was refactored and why.

---

## Summary

| Exercise | Main takeaway |
|----------|----------------|
| **Code Duplication (JavaScript)** | Replace repeated “average/max over field” loops with one parameterized helper (`statsForField`). Choose loop vs functional style based on team. Handle empty input explicitly. |
