# Decomposition Plan: generate_sales_report (Python)

## Distinct responsibilities

| # | Responsibility | Suggested helper / step |
|---|----------------|--------------------------|
| 1 | Validate input parameters (sales_data, report_type, output_format) | `_validate_params(sales_data, report_type, output_format)` |
| 2 | Parse and apply date range filter | `_filter_by_date_range(sales_data, date_range)` |
| 3 | Apply additional filters (key/value or key in list) | `_apply_filters(sales_data, filters)` |
| 4 | Handle empty data after filtering | early return / `_generate_empty_report` |
| 5 | Calculate basic metrics (total, avg, max, min) | `_calculate_summary_metrics(sales_data)` |
| 6 | Group data by product/category/customer/region | `_group_sales_data(sales_data, grouping)` |
| 7 | Build base report structure (summary + grouping) | `_build_report_structure(...)` |
| 8 | Add detailed transactions (for report_type == 'detailed') | `_add_detailed_transactions(report_data, sales_data)` |
| 9 | Add forecast (for report_type == 'forecast') | `_add_forecast_data(report_data, sales_data)` |
| 10 | Build charts data (sales over time, by group) | `_build_charts_data(sales_data, grouping, grouped_data)` |
| 11 | Output in requested format (json/html/excel/pdf) | `_generate_output(report_data, output_format, include_charts)` |

## Decomposition strategy

1. **Validate first:** Raise on invalid params; then filter data step by step.
2. **Data → metrics → structure:** Filter → metrics → grouping → report dict; then add optional sections (detailed, forecast, charts).
3. **Single output step:** One place that branches on `output_format` and calls the existing `_generate_*` stubs.
4. **Return early for no data:** After filtering, if list is empty, return empty structure or empty report file.

## Benefits

- **Readability:** Main function becomes a short pipeline; each step has one job.
- **Testability:** Each of `_filter_by_date_range`, `_apply_filters`, `_calculate_summary_metrics`, `_group_sales_data` can be tested with small lists.
- **Reuse:** Filtering and grouping logic could serve other report types or APIs.
- **Maintainability:** Add a new report type or output format by adding one branch or one helper.
