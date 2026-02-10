"""
AI Solution Verification Challenge - Buggy Merge Sort
"""

# Original buggy implementation
def merge_sort_buggy(arr):
    """Buggy merge sort implementation"""
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort_buggy(arr[:mid])
    right = merge_sort_buggy(arr[mid:])

    return merge_buggy(left, right)

def merge_buggy(left, right):
    """Buggy merge function - has subtle bug in final loops"""
    result = []
    i = 0
    j = 0

    # Main merge loop - this part is correct
    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    # Bug: Only one of these loops will execute correctly
    while i < len(left):
        result.append(left[i])
        j += 1  # BUG: Should be i += 1, not j += 1

    while j < len(right):
        result.append(right[j])
        j += 1

    return result

# Test function to verify sorting correctness
def test_sort_function(sort_func, name):
    """Test a sorting function with various inputs"""
    print(f"\n=== Testing {name} ===")
    
    test_cases = [
        # Basic cases
        ([1, 2, 3, 4, 5], "Already sorted"),
        ([5, 4, 3, 2, 1], "Reverse sorted"),
        ([3, 1, 4, 1, 5, 9, 2, 6], "Random order"),
        
        # Edge cases
        ([], "Empty array"),
        ([1], "Single element"),
        ([2, 1], "Two elements"),
        
        # Duplicates
        ([1, 1, 1, 1], "All same"),
        ([1, 2, 2, 1, 2, 1], "Multiple duplicates"),
        
        # Mixed positive/negative
        ([-3, 1, -1, 2, -2, 0], "Mixed signs"),
    ]
    
    all_passed = True
    
    for test_array, description in test_cases:
        try:
            result = sort_func(test_array.copy())
            expected = sorted(test_array)
            
            if result == expected:
                print(f"✓ {description}: PASS")
            else:
                print(f"✗ {description}: FAIL")
                print(f"  Input:    {test_array}")
                print(f"  Expected: {expected}")
                print(f"  Got:      {result}")
                all_passed = False
                
        except Exception as e:
            print(f"✗ {description}: ERROR - {e}")
            all_passed = False
    
    return all_passed

# Verification Strategy 1: Collaborative Solution Verification
def collaborative_verification():
    """Test with multiple approaches and compare results"""
    print("\n" + "="*50)
    print("VERIFICATION STRATEGY 1: Collaborative Solution Verification")
    print("="*50)
    
    # Test the buggy function
    buggy_passed = test_sort_function(merge_sort_buggy, "Buggy Merge Sort")
    
    # Test with Python's built-in sort for comparison
    def builtin_sort(arr):
        return sorted(arr)
    
    builtin_passed = test_sort_function(builtin_sort, "Built-in Sort")
    
    print(f"\nResults:")
    print(f"Buggy implementation: {'PASSED' if buggy_passed else 'FAILED'}")
    print(f"Built-in sort: {'PASSED' if builtin_passed else 'FAILED'}")
    
    return not buggy_passed  # Return True if bug detected

# Verification Strategy 2: Learning Through Alternative Approaches
def alternative_approaches():
    """Compare different merge sort implementations"""
    print("\n" + "="*50)
    print("VERIFICATION STRATEGY 2: Learning Through Alternative Approaches")
    print("="*50)
    
    # Alternative implementation 1: Fixed merge sort
    def merge_sort_fixed(arr):
        if len(arr) <= 1:
            return arr

        mid = len(arr) // 2
        left = merge_sort_fixed(arr[:mid])
        right = merge_sort_fixed(arr[mid:])

        return merge_fixed(left, right)

    def merge_fixed(left, right):
        result = []
        i = 0
        j = 0

        while i < len(left) and j < len(right):
            if left[i] < right[j]:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1

        # Fixed: Use correct increment variables
        while i < len(left):
            result.append(left[i])
            i += 1  # FIXED: Was j += 1

        while j < len(right):
            result.append(right[j])
            j += 1

        return result
    
    # Alternative implementation 2: Different merge approach
    def merge_sort_alt(arr):
        if len(arr) <= 1:
            return arr

        mid = len(arr) // 2
        left = merge_sort_alt(arr[:mid])
        right = merge_sort_alt(arr[mid:])

        return merge_alt(left, right)

    def merge_alt(left, right):
        """Alternative merge using different approach"""
        result = []
        left_idx, right_idx = 0, 0
        
        # Use extend for remaining elements
        while left_idx < len(left) and right_idx < len(right):
            if left[left_idx] <= right[right_idx]:
                result.append(left[left_idx])
                left_idx += 1
            else:
                result.append(right[right_idx])
                right_idx += 1
        
        # Add remaining elements using extend
        result.extend(left[left_idx:])
        result.extend(right[right_idx:])
        
        return result
    
    # Test all implementations
    implementations = [
        (merge_sort_buggy, "Buggy Implementation"),
        (merge_sort_fixed, "Fixed Implementation"),
        (merge_sort_alt, "Alternative Implementation"),
    ]
    
    results = {}
    for func, name in implementations:
        passed = test_sort_function(func, name)
        results[name] = passed
    
    print("\nComparison Results:")
    for name, passed in results.items():
        status = "✓ PASS" if passed else "✗ FAIL"
        print(f"{name}: {status}")
    
    return results

# Verification Strategy 3: Developing a Critical Eye
def critical_eye_analysis():
    """Scrutinize every line of code to find issues"""
    print("\n" + "="*50)
    print("VERIFICATION STRATEGY 3: Developing a Critical Eye")
    print("="*50)
    
    print("Analyzing the buggy merge function line by line:")
    print()
    
    code_analysis = [
        ("result = []", "✓ Initialize result array"),
        ("i = 0, j = 0", "✓ Initialize pointers"),
        ("while i < len(left) and j < len(right):", "✓ Main merge loop condition"),
        ("if left[i] < right[j]:", "✓ Comparison logic"),
        ("result.append(left[i]); i += 1", "✓ Add from left array"),
        ("result.append(right[j]); j += 1", "✓ Add from right array"),
        ("while i < len(left):", "✓ Check remaining left elements"),
        ("result.append(left[i])", "✓ Add remaining left element"),
        ("j += 1", "✗ BUG: Should increment i, not j"),
        ("while j < len(right):", "✓ Check remaining right elements"),
        ("result.append(right[j]); j += 1", "✓ Add remaining right elements"),
    ]
    
    for line, analysis in code_analysis:
        print(f"{line:<35} {analysis}")
    
    print("\nCritical Issues Found:")
    print("1. Variable increment bug in left array cleanup loop")
    print("2. This causes infinite loop or incorrect results")
    print("3. Bug only manifests when left array has remaining elements")
    
    # Demonstrate the bug with specific test case
    print("\nDemonstrating the bug:")
    test_case = [3, 1, 4, 2]
    print(f"Input: {test_case}")
    
    try:
        result = merge_sort_buggy(test_case)
        print(f"Buggy result: {result}")
        print(f"Correct result: {sorted(test_case)}")
        print(f"Bug reproduced: {result != sorted(test_case)}")
    except Exception as e:
        print(f"Error occurred: {e}")
    
    return True

# AI Solution (simulated)
def ai_solution():
    """Simulated AI-provided solution"""
    print("\n" + "="*50)
    print("AI-PROVIDED SOLUTION")
    print("="*50)
    
    print("AI Analysis:")
    print("The bug is in the merge function where 'j += 1' should be 'i += 1'")
    print("in the while loop that processes remaining left array elements.")
    print()
    
    print("AI Solution:")
    ai_code = '''
def merge_sort_fixed(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort_fixed(arr[:mid])
    right = merge_sort_fixed(arr[mid:])

    return merge_fixed(left, right)

def merge_fixed(left, right):
    result = []
    i = 0
    j = 0

    while i < len(left) and j < len(right):
        if left[i] < right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1

    # Fixed: Use correct increment variables
    while i < len(left):
        result.append(left[i])
        i += 1  # FIXED: Changed from j += 1 to i += 1

    while j < len(right):
        result.append(right[j])
        j += 1

    return result
'''
    
    print(ai_code)
    
    # Implement the AI solution
    def merge_sort_ai_fixed(arr):
        if len(arr) <= 1:
            return arr

        mid = len(arr) // 2
        left = merge_sort_ai_fixed(arr[:mid])
        right = merge_sort_ai_fixed(arr[mid:])

        return merge_ai_fixed(left, right)

    def merge_ai_fixed(left, right):
        result = []
        i = 0
        j = 0

        while i < len(left) and j < len(right):
            if left[i] < right[j]:
                result.append(left[i])
                i += 1
            else:
                result.append(right[j])
                j += 1

        # AI fix: Use correct increment variables
        while i < len(left):
            result.append(left[i])
            i += 1  # FIXED: Changed from j += 1 to i += 1

        while j < len(right):
            result.append(right[j])
            j += 1

        return result
    
    return merge_sort_ai_fixed

# Final verified implementation
def final_verified_solution():
    """Implement and test the final verified solution"""
    print("\n" + "="*50)
    print("FINAL VERIFIED SOLUTION")
    print("="*50)
    
    def merge_sort_verified(arr):
        """Final verified merge sort implementation"""
        if len(arr) <= 1:
            return arr

        mid = len(arr) // 2
        left = merge_sort_verified(arr[:mid])
        right = merge_sort_verified(arr[mid:])

        return merge_verified(left, right)

    def merge_verified(left, right):
        """Verified merge function with comprehensive comments"""
        result = []
        i = 0  # Pointer for left array
        j = 0  # Pointer for right array

        # Merge elements from both arrays while both have elements
        while i < len(left) and j < len(right):
            if left[i] < right[j]:
                result.append(left[i])
                i += 1  # Move to next element in left array
            else:
                result.append(right[j])
                j += 1  # Move to next element in right array

        # Add remaining elements from left array (if any)
        while i < len(left):
            result.append(left[i])
            i += 1  # FIXED: Increment i, not j

        # Add remaining elements from right array (if any)
        while j < len(right):
            result.append(right[j])
            j += 1

        return result
    
    # Comprehensive testing
    print("Running comprehensive tests...")
    passed = test_sort_function(merge_sort_verified, "Verified Merge Sort")
    
    if passed:
        print("\n✓ All tests passed! Solution is verified.")
    else:
        print("\n✗ Some tests failed. Solution needs more work.")
    
    return merge_sort_verified if passed else None

# Performance comparison
def performance_comparison():
    """Compare performance of different implementations"""
    print("\n" + "="*50)
    print("PERFORMANCE COMPARISON")
    print("="*50)
    
    import time
    import random
    
    # Generate test data
    sizes = [100, 1000, 5000]
    
    for size in sizes:
        print(f"\nTesting with {size} elements:")
        test_data = [random.randint(1, 1000) for _ in range(size)]
        
        # Test verified implementation
        start = time.time()
        result = final_verified_solution()(test_data.copy())
        end = time.time()
        
        print(f"Verified implementation: {end - start:.4f}s")
        print(f"Result correctness: {result == sorted(test_data)}")

if __name__ == "__main__":
    print("AI Solution Verification Challenge")
    print("="*50)
    
    # Run all verification strategies
    bug_detected = collaborative_verification()
    alternative_results = alternative_approaches()
    critical_analysis = critical_eye_analysis()
    ai_fixed_func = ai_solution()
    final_solution = final_verified_solution()
    
    if final_solution:
        performance_comparison()
    
    print("\n" + "="*50)
    print("VERIFICATION COMPLETE")
    print("="*50)
    print("Key Learnings:")
    print("1. Always test edge cases (empty arrays, single elements)")
    print("2. Scrutinize variable increments in loops")
    print("3. Compare with known-good implementations")
    print("4. Use comprehensive test suites")
    print("5. Verify AI solutions with multiple approaches")
