# Extraction Outline: processCustomerData (Java)

This outline shows how the main method would look after decomposition. Implement each helper so that behavior is preserved (same validation rules, same result map).

## Main method structure (after refactor)

```java
public Map<String, Object> processCustomerData(List<Map<String, Object>> rawData,
                                             String source,
                                             CustomerProcessingOptions options) {
    if (rawData == null || rawData.isEmpty()) {
        return errorResult("No data provided for processing");
    }

    // Load existing for deduplication (once)
    DedupSets existing = loadExistingForDeduplication(options);
    if (existing == null) {
        return errorResult("Failed to load existing customers for deduplication");
    }

    List<Map<String, Object>> validRecords = new ArrayList<>();
    List<Map<String, Object>> invalidRecords = new ArrayList<>();
    List<Map<String, Object>> duplicateRecords = new ArrayList<>();
    ProcessingCounts counts = new ProcessingCounts();

    for (Map<String, Object> record : rawData) {
        counts.totalProcessed++;
        if (options.getMaxErrorCount() > 0 && counts.totalErrors >= options.getMaxErrorCount()) {
            counts.totalSkipped = rawData.size() - counts.totalProcessed + 1;
            break;
        }

        Map<String, Object> processed = new HashMap<>(record);
        processed = preprocessBySource(processed, source);
        List<String> errors = new ArrayList<>();

        validateEmail(processed, validRecords, existing, options, errors);
        validateAndNormalizeNames(processed, errors);
        validatePhone(processed, validRecords, existing, options, errors);
        validateAddress(processed, errors);
        validateDateOfBirth(processed, errors);
        if (options.getCustomValidator() != null) {
            errors.addAll(options.getCustomValidator().validate(processed));
        }

        boolean isValid = errors.isEmpty();
        if (isValid) {
            validRecords.add(processed);
            counts.totalSuccess++;
        } else {
            processed.put("errors", errors);
            invalidRecords.add(processed);
            counts.totalErrors++;
            updateErrorCounts(counts.errorsByType, errors);
        }
    }

    if (options.isSaveToDatabase() && !validRecords.isEmpty()) {
        try {
            saveValidRecords(validRecords, source);
        } catch (Exception e) {
            return errorResult("Failed to save valid records to database", e.getMessage());
        }
    }

    return buildResult(source, rawData.size(), counts, validRecords,
                       invalidRecords, duplicateRecords, options);
}
```

## Helper roles (summary)

| Helper | Inputs | Side effects / return |
|--------|--------|------------------------|
| `loadExistingForDeduplication` | options | Queries DB; returns DedupSets or null on error. |
| `preprocessBySource` | record, source | Returns preprocessed map (delegate to existing CSV/API/manual methods). |
| `validateEmail` | processed, validRecords, existing, options, errors | Appends to errors; normalizes email in processed. Handles duplicate check. |
| `validateAndNormalizeNames` | processed, errors | Appends to errors; capitalizes firstName/lastName in processed. |
| `validatePhone` | processed, validRecords, existing, options, errors | Appends to errors; normalizes/formats phone in processed. |
| `validateAddress` | processed, errors | Appends to errors; parses/normalizes/validates address in processed. |
| `validateDateOfBirth` | processed, errors | Appends to errors; formats DOB in processed. |
| `buildResult` | source, total, counts, valid, invalid, duplicate, options | Returns the final Map (status, counts, optional record lists). |

## Small value objects (optional)

- **DedupSets:** `Set<String> emails; Set<String> phones;`
- **ProcessingCounts:** `totalProcessed, totalSuccess, totalErrors, totalSkipped, errorsByType`

These keep method signatures shorter and make it clear what is passed through the pipeline.

## Testing

- Unit test each validator with a `Map<String, Object>` and an empty `List<String>` for errors; assert errors list and map mutations.
- Integration test the full method with a small `rawData` list and mock repository/options.
