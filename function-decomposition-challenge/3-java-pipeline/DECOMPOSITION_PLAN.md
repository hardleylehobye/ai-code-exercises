# Decomposition Plan: processCustomerData (Java)

## Distinct responsibilities

| # | Responsibility | Suggested method / note |
|---|----------------|-------------------------|
| 1 | Validate input (rawData null/empty) | `validateInput(rawData)` or inline early return |
| 2 | Load existing records for deduplication | `loadExistingEmailsAndPhones(options)` → returns or populates `existingEmails`, `existingPhones` |
| 3 | Source-specific preprocessing (CSV / API / manual) | Already extracted: `preprocessCsvRecord`, `preprocessApiRecord`, `preprocessManualRecord` |
| 4 | Validate email (required, format, duplicate in batch + DB) | `validateAndNormalizeEmail(processedRecord, validRecords, existingEmails, options)` → returns errors list, mutates record |
| 5 | Validate and normalize firstName / lastName | `validateAndNormalizeName(processedRecord, "firstName")`; same for lastName; return list of errors |
| 6 | Validate and normalize phone (format, duplicate) | `validateAndNormalizePhone(processedRecord, validRecords, existingPhones, options)` |
| 7 | Process and validate address (parse, normalize, state, zip, country) | `validateAndNormalizeAddress(processedRecord)` → returns errors, mutates record |
| 8 | Validate and format date of birth (parse, age range, format) | `validateAndFormatDateOfBirth(processedRecord)` |
| 9 | Run custom validator | Already a single block; keep or `runCustomValidator(processedRecord, options)` |
| 10 | Decide valid vs invalid; track duplicates; error counts | `classifyRecord(validRecords, invalidRecords, duplicateRecords, processedRecord, recordErrors, isValid, options)` or keep inline but after all validations |
| 11 | Save valid records to DB | `saveValidRecordsToDatabase(validRecords, source)` |
| 12 | Build and return result map | `buildProcessingResult(...)` |

## Decomposition strategy

1. **Per-record pipeline:** For each record: preprocess by source → validate email → validate names → validate phone → validate address → validate DOB → custom validator → then add to valid/invalid/duplicate and update counts. Extract each validation into a method that takes the record and an errors list; returns or appends errors; mutates record when normalizing.
2. **Deduplication loading:** One method that loads existing customers and fills `existingEmails` / `existingPhones`; call once before the loop.
3. **Result building:** One method that builds the final `Map<String, Object>` from counts and option flags.
4. **Keep loop structure:** Main method still has the for-loop and max-error-threshold check; inside the loop it calls the validation helpers in sequence.

## Suggested method signatures (outline)

```text
// Before loop
Map<String, Set<String>> existing = loadExistingForDeduplication(options);

// Inside loop (per record)
List<String> recordErrors = new ArrayList<>();
processedRecord = preprocessBySource(record, source);
validateEmail(processedRecord, validRecords, existing, options, recordErrors);
validateAndNormalizeNames(processedRecord, recordErrors);
validatePhone(processedRecord, validRecords, existing, options, recordErrors);
validateAddress(processedRecord, recordErrors);
validateDateOfBirth(processedRecord, recordErrors);
if (options.getCustomValidator() != null) runCustomValidator(processedRecord, options, recordErrors);
boolean isValid = recordErrors.isEmpty();
// ... classify and add to validRecords / invalidRecords / duplicateRecords; update counts
```

## Benefits

- **Readability:** Main method shows the high-level pipeline; each validation is one call.
- **Testability:** Each validator can be unit tested with a map and mock options.
- **Reuse:** Email/phone/address validation could be used in a single-record API or import wizard.
- **Maintainability:** Change email or address rules in one place; add a new source by adding a preprocess method and one branch.

## Most reusable extracted methods

- **validateAndNormalizeEmail** (and similar for phone): Reusable in registration, profile update, or any form that collects contact info.
- **validateAndNormalizeAddress**: Reusable wherever address is captured (checkout, account, support).
- **validateAndFormatDateOfBirth**: Reusable for any age-restricted or DOB field.
