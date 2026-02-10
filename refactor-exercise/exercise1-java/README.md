# Exercise 1: Code Readability Improvement (Java)

## Readability issues identified

| Issue | Original | Improved | Why it matters |
|-------|----------|----------|----------------|
| Class name | `UserMgr`, `U` | `UserManager`, `User` | Standard Java: full words, no abbreviations. |
| Variable names | `u_list`, `d`, `un`, `pw`, `em`, `nu`, `res` | `users`, `db`, `username`, `password`, `email`, `newUser`, `saved` | Self-documenting; reduces need for comments. |
| Method names | `a()`, `f()` | `addUser()`, `findUserByUsername()` | Method name describes behavior. |
| Magic logic | Inline validation and lookup | `isValidRegistration()`, `findUserByUsername()` | Single responsibility; easier to test and reuse. |
| Null safety | Not checked | `username != null && ...` in validation | Avoids NPE and clarifies contract. |
| Security | String concatenation in SQL | Comment + TODO for prepared statement | Highlights SQL injection risk. |

## What the AI might also flag

- **Encapsulation:** Exposing `getPassword()` is risky; consider not exposing or masking.
- **Consistency:** Constructor parameter `d` renamed to `db` and assigned to `this.db` for clarity.
- **Immutability:** `User` fields could be `final` to signal immutability.
