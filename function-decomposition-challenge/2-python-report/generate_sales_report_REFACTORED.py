"""
Decomposed generate_sales_report: responsibilities split into helpers.
Behavior preserved; main function is a short pipeline.
"""

from datetime import datetime


def generate_sales_report(sales_data, report_type='summary', date_range=None,
                          filters=None, grouping=None, include_charts=False,
                          output_format='pdf'):
    _validate_params(sales_data, report_type, output_format)
    data = _filter_by_date_range(sales_data, date_range)
    data = _apply_filters(data, filters)

    if not data:
        if output_format == 'json':
            return {"message": "No data matches the specified criteria", "data": []}
        return _generate_empty_report(report_type, output_format)

    summary = _calculate_summary_metrics(data)
    grouped_data = _group_sales_data(data, grouping) if grouping else {}
    report_data = _build_report_structure(
        report_type, date_range, filters, summary, data, grouping, grouped_data
    )
    if report_type == 'detailed':
        _add_detailed_transactions(report_data, data)
    if report_type == 'forecast':
        report_data['forecast'] = _compute_forecast(data)
    if include_charts:
        report_data['charts'] = _build_charts_data(data, grouping, grouped_data)

    if output_format == 'json':
        return report_data
    if output_format == 'html':
        return _generate_html_report(report_data, include_charts)
    if output_format == 'excel':
        return _generate_excel_report(report_data, include_charts)
    if output_format == 'pdf':
        return _generate_pdf_report(report_data, include_charts)
    return report_data


def _validate_params(sales_data, report_type, output_format):
    if not sales_data or not isinstance(sales_data, list):
        raise ValueError("Sales data must be a non-empty list")
    if report_type not in ['summary', 'detailed', 'forecast']:
        raise ValueError("Report type must be 'summary', 'detailed', or 'forecast'")
    if output_format not in ['pdf', 'excel', 'html', 'json']:
        raise ValueError("Output format must be 'pdf', 'excel', 'html', or 'json'")


def _filter_by_date_range(sales_data, date_range):
    if not date_range:
        return sales_data
    if 'start' not in date_range or 'end' not in date_range:
        raise ValueError("Date range must include 'start' and 'end' dates")
    start_date = datetime.strptime(date_range['start'], '%Y-%m-%d')
    end_date = datetime.strptime(date_range['end'], '%Y-%m-%d')
    if start_date > end_date:
        raise ValueError("Start date cannot be after end date")
    filtered = []
    for sale in sales_data:
        sale_date = datetime.strptime(sale['date'], '%Y-%m-%d')
        if start_date <= sale_date <= end_date:
            filtered.append(sale)
    return filtered


def _apply_filters(sales_data, filters):
    if not filters:
        return sales_data
    result = sales_data
    for key, value in filters.items():
        if isinstance(value, list):
            result = [sale for sale in result if sale.get(key) in value]
        else:
            result = [sale for sale in result if sale.get(key) == value]
    return result


def _calculate_summary_metrics(sales_data):
    total_sales = sum(sale['amount'] for sale in sales_data)
    n = len(sales_data)
    max_sale = max(sales_data, key=lambda x: x['amount'])
    min_sale = min(sales_data, key=lambda x: x['amount'])
    return {
        'total_sales': total_sales,
        'transaction_count': n,
        'average_sale': total_sales / n,
        'max_sale': {'amount': max_sale['amount'], 'date': max_sale['date'], 'details': max_sale},
        'min_sale': {'amount': min_sale['amount'], 'date': min_sale['date'], 'details': min_sale},
    }


def _group_sales_data(sales_data, grouping):
    grouped = {}
    for sale in sales_data:
        key = sale.get(grouping, 'Unknown')
        if key not in grouped:
            grouped[key] = {'count': 0, 'total': 0, 'items': []}
        grouped[key]['count'] += 1
        grouped[key]['total'] += sale['amount']
        grouped[key]['items'].append(sale)
    for key in grouped:
        grouped[key]['average'] = grouped[key]['total'] / grouped[key]['count']
    return grouped


def _build_report_structure(report_type, date_range, filters, summary, sales_data,
                            grouping, grouped_data):
    report_data = {
        'report_type': report_type,
        'date_generated': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'date_range': date_range,
        'filters': filters,
        'summary': summary,
    }
    total_sales = summary['total_sales']
    if grouping and grouped_data:
        report_data['grouping'] = {
            'by': grouping,
            'groups': {
                k: {
                    'count': d['count'],
                    'total': d['total'],
                    'average': d['average'],
                    'percentage': (d['total'] / total_sales) * 100,
                }
                for k, d in grouped_data.items()
            },
        }
    return report_data


def _add_detailed_transactions(report_data, sales_data):
    report_data['transactions'] = []
    for sale in sales_data:
        transaction = dict(sale)
        if 'tax' in sale and 'amount' in sale:
            transaction['pre_tax'] = sale['amount'] - sale['tax']
        if 'cost' in sale and 'amount' in sale:
            transaction['profit'] = sale['amount'] - sale['cost']
            transaction['margin'] = (transaction['profit'] / sale['amount']) * 100
        report_data['transactions'].append(transaction)


def _compute_forecast(sales_data):
    monthly_sales = {}
    for sale in sales_data:
        sale_date = datetime.strptime(sale['date'], '%Y-%m-%d')
        month_key = f"{sale_date.year}-{sale_date.month:02d}"
        monthly_sales[month_key] = monthly_sales.get(month_key, 0) + sale['amount']

    sorted_months = sorted(monthly_sales.keys())
    growth_rates = []
    for i in range(1, len(sorted_months)):
        prev_amount = monthly_sales[sorted_months[i - 1]]
        curr_amount = monthly_sales[sorted_months[i]]
        if prev_amount > 0:
            growth_rates.append(((curr_amount - prev_amount) / prev_amount) * 100)
    avg_growth_rate = sum(growth_rates) / len(growth_rates) if growth_rates else 0

    forecast = {}
    if sorted_months:
        last_month = sorted_months[-1]
        last_amount = monthly_sales[last_month]
        year, month = map(int, last_month.split('-'))
        for i in range(1, 4):
            month += 1
            if month > 12:
                month, year = 1, year + 1
            forecast_month = f"{year}-{month:02d}"
            forecast_amount = last_amount * (1 + (avg_growth_rate / 100))
            forecast[forecast_month] = forecast_amount
            last_amount = forecast_amount

    growth_by_month = {}
    for i in range(1, len(sorted_months)):
        growth_by_month[sorted_months[i]] = growth_rates[i - 1] if i - 1 < len(growth_rates) else None

    return {
        'monthly_sales': monthly_sales,
        'growth_rates': growth_by_month,
        'average_growth_rate': avg_growth_rate,
        'projected_sales': forecast,
    }


def _build_charts_data(sales_data, grouping, grouped_data):
    charts_data = {}
    date_sales = {}
    for sale in sales_data:
        date_sales[sale['date']] = date_sales.get(sale['date'], 0) + sale['amount']
    charts_data['sales_over_time'] = {
        'labels': sorted(date_sales.keys()),
        'data': [date_sales[d] for d in sorted(date_sales.keys())],
    }
    if grouping and grouped_data:
        charts_data['sales_by_' + grouping] = {
            'labels': list(grouped_data.keys()),
            'data': [grouped_data[k]['total'] for k in grouped_data],
        }
    return charts_data


def _generate_empty_report(report_type, output_format):
    pass


def _generate_html_report(report_data, include_charts):
    pass


def _generate_excel_report(report_data, include_charts):
    pass


def _generate_pdf_report(report_data, include_charts):
    pass
