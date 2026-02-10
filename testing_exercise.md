# AI Testing Exercise - Task Manager JavaScript

## Part 1: Understanding What to Test

### Exercise 1.1: Behavior Analysis

**AI Prompt for calculateTaskScore analysis:**

"I'm learning how to test this function, and I want to understand what behaviors I should test:

```javascript
calculateTaskScore(task) {
    const priorityWeights = {
      [TaskPriority.LOW]: 1,
      [TaskPriority.MEDIUM]: 2,
      [TaskPriority.HIGH]: 4,
      [TaskPriority.URGENT]: 6
    };
    let score = (priorityWeights[task.priority] || 0) * 10;
    
    if (task.dueDate) {
      const now = new Date();
      const dueDate = new Date(task.dueDate);
      const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
      
      if (daysUntilDue < 0) {
        score += 35;
      } else if (daysUntilDue === 0) {
        score += 20;
      } else if (daysUntilDue <= 2) {
        score += 15;
      } else if (daysUntilDue <= 7) {
        score += 10;
      }
    }
    
    if (task.status === TaskStatus.DONE) {
      score -= 50;
    } else if (task.status === TaskStatus.REVIEW) {
      score -= 15;
    }
    
    if (task.tags && task.tags.some(tag => ["blocker", "critical", "urgent"].includes(tag))) {
      score += 8;
    }
    
    if (task.updatedAt) {
      const now = new Date();
      const updatedAt = new Date(task.updatedAt);
      const daysSinceUpdate = Math.floor((now - updatedAt) / (1000 * 60 * 60 * 24));
      if (daysSinceUpdate < 1) {
        score += 5;
      }
    }
    
    return Math.max(0, score);
}
```

Rather than generating tests for me, please:
1. Ask me questions about what I think this function does
2. After I answer, help identify any behaviors I missed
3. Ask me what edge cases I think should be tested
4. Help me identify additional edge cases I didn't think of
5. Ask me which test I should write first and why"

### Exercise 1.2: Test Planning

**AI Prompt for testing all three functions:**

"I'm learning to write tests for these related functions:

```javascript
sortTasksByImportance(tasks) {
    return [...tasks].sort((a, b) => {
      return this.calculateTaskScore(b) - this.calculateTaskScore(a);
    });
}

getTopPriorityTasks(tasks, limit = 5) {
    const sortedTasks = this.sortTasksByImportance(tasks);
    return sortedTasks.slice(0, limit);
}
```

Instead of writing tests for me, please:
1. Help me create a testing plan by asking me questions
2. For each behavior I identify, ask me how I would test it
3. If I miss something important, give me hints rather than answers
4. For each edge case we identify, ask me what I expect to happen
5. Help me create a checklist of tests I should write, organized by priority"

## Part 2: Improving a Single Test

### Exercise 2.1: Writing Your First Test

**AI Prompt for test improvement:**

"I wrote this test for the calculateTaskScore function:

```javascript
test('basic priority scoring', () => {
  const task = {
    priority: TaskPriority.HIGH,
    status: TaskStatus.TODO,
    dueDate: null,
    tags: [],
    updatedAt: new Date()
  };
  
  const score = calculateTaskScore(task);
  expect(score).toBe(40); // HIGH priority = 4 * 10
});
```

Instead of rewriting it for me, please:
1. Ask me questions about what my test is trying to verify
2. Help me identify if my test is checking behavior or implementation details
3. Suggest how I could make the test's purpose clearer
4. Ask me what edge cases my test might be missing
5. Guide me in improving my assertions to be more precise"

### Exercise 2.2: Learning From Examples

**AI Prompt for due date testing:**

"I'm trying to understand how to better test the due date calculation portion of this function:

[Same calculateTaskScore function]

I'm thinking of writing a test like this:
```javascript
test('overdue task gets boost', () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const task = {
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.TODO,
    dueDate: yesterday,
    tags: [],
    updatedAt: new Date()
  };
  
  const score = calculateTaskScore(task);
  expect(score).toBe(55); // MEDIUM (2*10) + overdue (35) = 55
});
```

Please:
1. Explain the principles of a good test for this specific functionality
2. Show me ONE example of a better test with comments explaining why it's better
3. Ask me questions about how I would improve my approach based on this example
4. Challenge me to identify what edge cases I should add
5. Guide me in writing more precise assertions"

## Part 3: Test-Driven Development Practice

### Exercise 3.1: TDD for New Feature

**AI Prompt for user assignment feature:**

"I want to practice Test-Driven Development to add a new feature:
Tasks assigned to the current user should get a score boost of +12.

Here's the current calculateTaskScore function:
[Same function]

Instead of writing code and tests for me, please:
1. Ask me what I think the first test should be and why
2. Give me feedback on my proposed test
3. After I write the test, ask me what minimal code would make it pass
4. Once I've implemented the code, guide me on what test to add next
5. Help me understand when it's time to refactor vs. add new functionality"

### Exercise 3.2: TDD for Bug Fix

**AI Prompt for days since update bug:**

"I want to practice TDD to fix a bug:
The calculation for 'days since update' isn't working correctly.

Here's the current function:
[Same function]

Please:
1. Ask me what test I would write to reproduce the bug
2. Help me understand if my test actually demonstrates the bug
3. Guide me in implementing a minimal fix
4. Ask me if there are any other tests I should add to prevent regression
Write a test that demonstrates the bug, then fix the code to make test pass."

## Part 4: Integration Testing

### Exercise 4.1: Testing the Full Workflow

**AI Prompt for integration testing:**

"I want to create an integration test for the task priority workflow:

```javascript
// All three functions together
calculateTaskScore(task)
sortTasksByImportance(tasks)
getTopPriorityTasks(tasks, limit)
```

Rather than writing the test for me, please:
1. Ask me what scenarios an integration test should verify
2. Guide me in designing test data that would exercise the entire workflow
3. Help me understand what assertions would verify correct behavior
4. Ask me how I would structure the test to make it readable and maintainable"

## Discussion Questions

After completing all parts, prepare answers for:

1. How did your confidence in solution change after verification?
2. What aspects of AI solution required the most scrutiny?
3. Which verification technique was most valuable for your specific problem?
4. How would you approach similar testing challenges in the future?
