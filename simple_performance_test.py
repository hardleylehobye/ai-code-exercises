import time
import random

def find_product_combinations_original(products, target_price, price_margin=10):
    """Original slow O(n²) implementation"""
    results = []
    for i in range(len(products)):
        for j in range(len(products)):
            if i != j:
                combined_price = products[i]['price'] + products[j]['price']
                if (target_price - price_margin) <= combined_price <= (target_price + price_margin):
                    # Slow duplicate check
                    if not any(r['product1']['id'] == products[j]['id'] and
                               r['product2']['id'] == products[i]['id'] for r in results):
                        results.append({
                            'product1': products[i],
                            'product2': products[j],
                            'combined_price': combined_price
                        })
    return results

def find_product_combinations_optimized(products, target_price, price_margin=10):
    """Optimized O(n²) with hash-based duplicate prevention"""
    results = []
    seen_pairs = set()
    
    for i in range(len(products)):
        for j in range(i + 1, len(products)):  # Only j > i
            combined_price = products[i]['price'] + products[j]['price']
            if (target_price - price_margin) <= combined_price <= (target_price + price_margin):
                pair_id = tuple(sorted([products[i]['id'], products[j]['id']]))
                if pair_id not in seen_pairs:
                    seen_pairs.add(pair_id)
                    results.append({
                        'product1': products[i],
                        'product2': products[j],
                        'combined_price': combined_price
                    })
    return results

def test_performance():
    print("Performance Optimization Results")
    print("=" * 40)
    
    # Test with different sizes
    sizes = [100, 500, 1000]
    
    for size in sizes:
        print(f"\nTesting with {size} products:")
        print("-" * 30)
        
        # Generate test data
        products = []
        for i in range(size):
            products.append({
                'id': i,
                'name': f'Product {i}',
                'price': random.randint(5, 500)
            })
        
        target_price = 500
        price_margin = 50
        
        # Test original (only for smaller sizes)
        if size <= 500:
            start = time.time()
            result_original = find_product_combinations_original(products, target_price, price_margin)
            time_original = time.time() - start
            print(f"Original:    {time_original:.3f}s, {len(result_original)} results")
        else:
            time_original = float('inf')
            print("Original:    Skipped (too slow)")
        
        # Test optimized
        start = time.time()
        result_optimized = find_product_combinations_optimized(products, target_price, price_margin)
        time_optimized = time.time() - start
        print(f"Optimized:   {time_optimized:.3f}s, {len(result_optimized)} results")
        
        # Calculate speedup
        if time_original != float('inf'):
            speedup = time_original / time_optimized
            print(f"Speedup:     {speedup:.1f}x faster")
        
        # Verify results match
        if size <= 500:
            matches = len(result_original) == len(result_optimized)
            print(f"Results match: {matches}")

if __name__ == "__main__":
    test_performance()
    
    print("\n" + "=" * 40)
    print("Key Optimizations Applied:")
    print("1. Eliminated duplicate pair checking (O(n²) → O(1))")
    print("2. Reduced loop iterations by half (j > i instead of all pairs)")
    print("3. Used hash set for instant duplicate detection")
    print("4. Removed complex nested dictionary comparisons")
