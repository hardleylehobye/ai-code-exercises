import time
import random
import cProfile
import pstats

def find_product_combinations_original(products, target_price, price_margin=10):
    """
    Original slow implementation - O(n²) with inefficient duplicate checking
    """
    results = []

    # For each possible pair of products
    for i in range(len(products)):
        for j in range(len(products)):
            # Skip comparing a product with itself
            if i != j:
                product1 = products[i]
                product2 = products[j]

                # Calculate combined price
                combined_price = product1['price'] + product2['price']

                # Check if the combined price is within the target range
                if (target_price - price_margin) <= combined_price <= (target_price + price_margin):
                    # Avoid duplicates like (product1, product2) and (product2, product1)
                    if not any(r['product1']['id'] == product2['id'] and
                               r['product2']['id'] == product1['id'] for r in results):

                        pair = {
                            'product1': product1,
                            'product2': product2,
                            'combined_price': combined_price,
                            'price_difference': abs(target_price - combined_price)
                        }
                        results.append(pair)

    # Sort by price difference from target
    results.sort(key=lambda x: x['price_difference'])
    return results

def find_product_combinations_hash(products, target_price, price_margin=10):
    """
    Optimized version using hash set for duplicate prevention.
    Time Complexity: O(n²) but with constant-time duplicate checking
    """
    results = []
    seen_pairs = set()  # O(1) lookup instead of O(n)
    
    for i in range(len(products)):
        for j in range(i + 1, len(products)):  # Only j > i, no duplicates
            product1 = products[i]
            product2 = products[j]
            
            combined_price = product1['price'] + product2['price']
            
            if (target_price - price_margin) <= combined_price <= (target_price + price_margin):
                # Create unique pair identifier
                pair_id = tuple(sorted([product1['id'], product2['id']]))
                
                if pair_id not in seen_pairs:
                    seen_pairs.add(pair_id)
                    pair = {
                        'product1': product1,
                        'product2': product2,
                        'combined_price': combined_price,
                        'price_difference': abs(target_price - combined_price)
                    }
                    results.append(pair)
    
    results.sort(key=lambda x: x['price_difference'])
    return results

def find_product_combinations_two_pointer(products, target_price, price_margin=10):
    """
    Optimized version using two-pointer technique after sorting.
    Time Complexity: O(n log n) + O(n) = O(n log n)
    """
    # Sort products by price for two-pointer approach
    products_sorted = sorted(products, key=lambda x: x['price'])
    results = []
    n = len(products_sorted)
    
    # Use two pointers to find valid pairs
    left = 0
    right = n - 1
    
    while left < right:
        product1 = products_sorted[left]
        product2 = products_sorted[right]
        combined_price = product1['price'] + product2['price']
        
        # Check if within target range
        if abs(combined_price - target_price) <= price_margin:
            pair = {
                'product1': product1,
                'product2': product2,
                'combined_price': combined_price,
                'price_difference': abs(target_price - combined_price)
            }
            results.append(pair)
            
            # Move both pointers to find other combinations
            left += 1
            right -= 1
        elif combined_price < target_price - price_margin:
            # Need higher sum, move left pointer right
            left += 1
        else:
            # Sum too high, move right pointer left
            right -= 1
    
    # Sort by price difference from target
    results.sort(key=lambda x: x['price_difference'])
    return results

def find_product_combinations_prefilter(products, target_price, price_margin=10):
    """
    Pre-filter products to reduce search space, then use optimized algorithm.
    """
    # Pre-filter: only products that could possibly be in a valid pair
    min_product_price = min(p['price'] for p in products)
    max_product_price = max(p['price'] for p in products)
    
    # Calculate valid price range for individual products
    min_valid_price = max(1, target_price - price_margin - max_product_price)
    max_valid_price = target_price + price_margin - min_product_price
    
    filtered_products = [
        p for p in products 
        if min_valid_price <= p['price'] <= max_valid_price
    ]
    
    print(f"Filtered from {len(products)} to {len(filtered_products)} products")
    
    # Use the hash-based approach on filtered data
    return find_product_combinations_hash(filtered_products, target_price, price_margin)

def benchmark_functions():
    """Benchmark all implementations with different data sizes"""
    
    # Test with different data sizes
    test_sizes = [100, 500, 1000, 2000]
    
    for size in test_sizes:
        print(f"\n=== Testing with {size} products ===")
        
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
        
        # Test original implementation (only for smaller sizes)
        if size <= 1000:
            print("Testing original implementation...")
            start = time.time()
            result_original = find_product_combinations_original(products, target_price, price_margin)
            time_original = time.time() - start
            print(f"Original: {time_original:.2f}s, Found {len(result_original)} combinations")
        
        # Test hash-based implementation
        print("Testing hash-based implementation...")
        start = time.time()
        result_hash = find_product_combinations_hash(products, target_price, price_margin)
        time_hash = time.time() - start
        print(f"Hash-based: {time_hash:.2f}s, Found {len(result_hash)} combinations")
        
        # Test two-pointer implementation
        print("Testing two-pointer implementation...")
        start = time.time()
        result_two_pointer = find_product_combinations_two_pointer(products, target_price, price_margin)
        time_two_pointer = time.time() - start
        print(f"Two-pointer: {time_two_pointer:.2f}s, Found {len(result_two_pointer)} combinations")
        
        # Test pre-filtered implementation
        print("Testing pre-filtered implementation...")
        start = time.time()
        result_prefilter = find_product_combinations_prefilter(products, target_price, price_margin)
        time_prefilter = time.time() - start
        print(f"Pre-filtered: {time_prefilter:.2f}s, Found {len(result_prefilter)} combinations")
        
        # Calculate speedups
        if size <= 1000 and time_original > 0:
            speedup_hash = time_original / time_hash if time_hash > 0 else float('inf')
            speedup_two_pointer = time_original / time_two_pointer if time_two_pointer > 0 else float('inf')
            speedup_prefilter = time_original / time_prefilter if time_prefilter > 0 else float('inf')
            print(f"Hash-based speedup: {speedup_hash:.1f}x")
            print(f"Two-pointer speedup: {speedup_two_pointer:.1f}x")
            print(f"Pre-filtered speedup: {speedup_prefilter:.1f}x")

def profile_implementation():
    """Profile the implementations to see where time is spent"""
    
    # Generate test data
    products = []
    for i in range(1000):  # Smaller dataset for profiling
        products.append({
            'id': i,
            'name': f'Product {i}',
            'price': random.randint(5, 500)
        })
    
    target_price = 500
    price_margin = 50
    
    print("=== Profiling Original Implementation ===")
    profiler = cProfile.Profile()
    profiler.enable()
    result = find_product_combinations_original(products, target_price, price_margin)
    profiler.disable()
    
    stats = pstats.Stats(profiler)
    stats.sort_stats('cumulative')
    stats.print_stats(10)
    
    print(f"Found {len(result)} combinations")

def memory_usage_test():
    """Test memory usage of different implementations"""
    
    import tracemalloc
    
    # Generate test data
    products = []
    for i in range(2000):
        products.append({
            'id': i,
            'name': f'Product {i}',
            'price': random.randint(5, 500)
        })
    
    target_price = 500
    price_margin = 50
    
    implementations = [
        ("Original", find_product_combinations_original),
        ("Hash-based", find_product_combinations_hash),
        ("Two-pointer", find_product_combinations_two_pointer),
        ("Pre-filtered", find_product_combinations_prefilter)
    ]
    
    for name, func in implementations:
        print(f"\n=== Memory Test: {name} ===")
        
        tracemalloc.start()
        
        start = time.time()
        result = func(products, target_price, price_margin)
        end = time.time()
        
        current, peak = tracemalloc.get_traced_memory()
        tracemalloc.stop()
        
        print(f"Time: {end - start:.2f}s")
        print(f"Current memory: {current / 1024 / 1024:.1f} MB")
        print(f"Peak memory: {peak / 1024 / 1024:.1f} MB")
        print(f"Results: {len(result)} combinations")

if __name__ == "__main__":
    print("Performance Optimization Exercise")
    print("=================================")
    
    # Run benchmarks
    benchmark_functions()
    
    # Run profiling
    print("\n" + "="*50)
    profile_implementation()
    
    # Run memory tests
    print("\n" + "="*50)
    memory_usage_test()
    
    print("\n" + "="*50)
    print("Exercise complete! Check the results above.")
