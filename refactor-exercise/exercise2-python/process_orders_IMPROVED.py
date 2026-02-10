# IMPROVED - Exercise 2: Function Refactoring (Python)
# One function = one responsibility; smaller functions are testable and reusable.

def process_orders(orders, inventory, customer_data):
    results = []
    error_orders = []

    for order in orders:
        validation_error = validate_order(order, inventory, customer_data)
        if validation_error:
            error_orders.append(validation_error)
            continue

        item_id = order['item_id']
        quantity = order['quantity']
        customer_id = order['customer_id']

        price = calculate_line_price(inventory[item_id], quantity)
        price = apply_premium_discount(price, customer_data[customer_id])
        shipping = calculate_shipping(price, customer_data[customer_id]['location'])
        tax = price * 0.08
        final_price = price + shipping + tax

        inventory[item_id]['quantity'] -= quantity

        results.append({
            'order_id': order['order_id'],
            'item_id': item_id,
            'quantity': quantity,
            'customer_id': customer_id,
            'price': price,
            'shipping': shipping,
            'tax': tax,
            'final_price': final_price,
        })

    total_revenue = sum(r['final_price'] for r in results)

    return {
        'processed_orders': results,
        'error_orders': error_orders,
        'total_revenue': total_revenue,
    }


def validate_order(order, inventory, customer_data):
    """Returns an error dict if order is invalid, else None."""
    order_id = order['order_id']
    item_id = order.get('item_id')
    quantity = order.get('quantity')
    customer_id = order.get('customer_id')

    if item_id not in inventory:
        return {'order_id': order_id, 'error': 'Item not in inventory'}
    if inventory[item_id]['quantity'] < quantity:
        return {'order_id': order_id, 'error': 'Insufficient quantity'}
    if customer_id not in customer_data:
        return {'order_id': order_id, 'error': 'Customer not found'}
    return None


def calculate_line_price(item, quantity):
    return item['price'] * quantity


def apply_premium_discount(price, customer):
    if customer.get('premium'):
        return price * 0.9
    return price


def calculate_shipping(price_before_shipping, location):
    if location == 'domestic':
        return 5.99 if price_before_shipping < 50 else 0
    return 15.99
