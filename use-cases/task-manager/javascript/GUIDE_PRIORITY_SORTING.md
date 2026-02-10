# How to Use Priority Sorting in Task Manager CLI

This guide will walk you through using the intelligent priority sorting feature in Task Manager CLI, which helps you focus on the most important tasks based on multiple factors.

## Prerequisites

Before you begin, make sure you have:

- Task Manager CLI installed and working
- Some tasks created (or create them during this guide)
- Basic understanding of command-line operations

## What is Priority Sorting?

Priority sorting uses a sophisticated scoring algorithm that evaluates each task based on:

- **Priority Level** (1-4): The base importance you assign
- **Due Date**: How soon the task is due (overdue tasks get highest boost)
- **Status**: Whether the task is completed (completed tasks are heavily penalized)
- **Tags**: Special tags like "urgent", "critical", or "blocker"
- **Recent Updates**: Tasks modified recently get a small boost

The algorithm calculates a score (0-100+) and sorts tasks from highest to lowest score.

## Step 1: Create Tasks with Different Priorities

Let's create some sample tasks to see how priority sorting works:

### Create High Priority Tasks

```bash
# Create an urgent task due today
node cli.js create "Fix critical production bug" -p 4 -u 2026-02-10 -t "critical,blocker"

# Create a high priority task due tomorrow
node cli.js create "Complete client presentation" -p 3 -u 2026-02-11 -t "client,important"

# Create an urgent task with no due date
node cli.js create "Review security report" -p 4 -t "security,urgent"
```

### Create Medium and Low Priority Tasks

```bash
# Create medium priority task
node cli.js create "Update documentation" -p 2 -u 2026-02-15 -t "docs"

# Create low priority task
node cli.js create "Organize desk" -p 1

# Create overdue medium priority task
node cli.js create "Submit expense report" -p 2 -u 2026-02-05 -t "finance"
```

## Step 2: View Priority-Sorted Tasks

Now let's see how the algorithm sorts these tasks:

### Basic Priority View

```bash
# Show top 5 priority tasks
node cli.js top
```

You should see something like:
```
Top 5 priority tasks:

1. [ ] abc123 - !!!! Fix critical production bug
  Critical production bug
  Due: 2026-02-10 | Tags: critical, blocker
  Created: 2026-02-10 10:30:00
--------------------------------------------------
2. [ ] def456 - !!! Complete client presentation
  Client presentation
  Due: 2026-02-11 | Tags: client, important
  Created: 2026-02-10 10:31:00
--------------------------------------------------
3. [ ] ghi789 - !!!! Review security report
  Security report
  No due date | Tags: security, urgent
  Created: 2026-02-10 10:32:00
--------------------------------------------------
```

### View with Scores

```bash
# Show priority scores to understand the algorithm
node cli.js top --show-scores
```

This reveals the calculated scores:
```
Top 5 priority tasks:

1. [Score: 103] [ ] abc123 - !!!! Fix critical production bug
  Critical production bug
  Due: 2026-02-10 | Tags: critical, blocker
  Created: 2026-02-10 10:30:00
--------------------------------------------------
2. [Score: 88] [ ] def456 - !!! Complete client presentation
  Client presentation
  Due: 2026-02-11 | Tags: client, important
  Created: 2026-02-10 10:31:00
--------------------------------------------------
```

## Step 3: Understand the Scoring

Let's analyze why tasks are ranked this way by checking individual scores:

### Check Score Breakdown

```bash
# Check score for the top task
node cli.js score abc123
```

Output:
```
Task: Fix critical production bug
Priority Score: 103
Priority: 4
Status: todo
Due Date: 2026-02-10
Tags: critical, blocker
Last Updated: 2026-02-10
```

**Score Breakdown:**
- Base priority: 4 × 10 = 40
- Due today: +20
- Critical tag: +8
- Blocker tag: +8
- Recent update: +5
- **Total: 103**

### Compare Different Task Types

```bash
# Check score for a medium priority task
node cli.js score jkl012

# Check score for an overdue task
node cli.js score mno345
```

You'll notice:
- **Overdue tasks** get +35 points (highest boost)
- **Due today** tasks get +20 points
- **High priority** (4) gets 40 base points vs low priority (1) gets 10
- **Special tags** add +8 points each

## Step 4: Manipulate Task Priorities

Now let's see how changes affect the sorting:

### Change Task Priority

```bash
# Update a task to urgent priority
node cli.js priority jkl012 4

# Check how it affects the sorting
node cli.js top --show-scores
```

The task should now appear higher in the list with an increased score.

### Add Special Tags

```bash
# Add urgent tag to boost score
node cli.js tag jkl012 urgent

# Check the new ranking
node cli.js top --show-scores
```

### Update Due Date

```bash
# Make a task due today for maximum boost
node cli.js due jkl012 2026-02-10

# See the impact
node cli.js top --show-scores
```

## Step 5: Complete Tasks and See Impact

### Mark High-Scoring Tasks as Complete

```bash
# Complete the top priority task
node cli.js status abc123 done

# Check the new priority list
node cli.js top --show-scores
```

Notice the completed task disappears from the top list because:
- Completed tasks get -50 penalty
- This usually makes their score drop to 0 (minimum)

### Check Completed Task Score

```bash
# Check the score of completed task
node cli.js score abc123
```

The score will be much lower (likely 0) due to the completion penalty.

## Step 6: Advanced Usage

### Custom Priority Views

```bash
# Show top 10 tasks instead of default 5
node cli.js top -l 10

# Show only top 3 tasks
node cli.js top -l 3 --show-scores
```

### Filter and Sort

```bash
# Show only todo tasks, then sort by priority
node cli.js list --status todo

# Show only high priority tasks
node cli.js list --priority 4
```

### Daily Workflow Integration

Make priority sorting part of your daily routine:

```bash
# Morning: Check your top priorities
node cli.js top --show-scores

# Throughout day: Update tasks as you work
node cli.js status <task-id> in_progress

# Evening: Complete tasks and check tomorrow's priorities
node cli.js status <task-id> done
node cli.js top
```

## Troubleshooting

### Common Issues

#### Tasks Not Sorting as Expected

**Problem**: A task you think should be first isn't appearing at the top.

**Solution**: 
1. Check the task's score: `node cli.js score <task-id>`
2. Verify all factors: priority, due date, tags, status
3. Check if the task is completed (completed tasks are heavily penalized)

#### All Tasks Have Same Score

**Problem**: Multiple tasks show the same score.

**Solution**: 
1. Check if tasks have the same priority level
2. Verify due dates and tags
3. Tasks with identical attributes will have identical scores

#### Negative Scores

**Problem**: Some tasks show negative scores.

**Solution**: This shouldn't happen with the current algorithm (minimum is 0), but if you see it:
1. Check if the task is completed (-50 penalty)
2. Verify the task has valid priority level
3. Report the issue if it persists

### Performance Issues

#### Slow Sorting with Many Tasks

**Problem**: Priority sorting is slow with hundreds of tasks.

**Solution**: 
1. Export and archive old completed tasks: `node cli.js export --status done old-tasks.csv`
2. Delete old completed tasks manually
3. Consider using filters: `node cli.js top -l 10` for smaller lists

## Best Practices

### 1. Use Priority Levels Consistently

- **Level 1**: Routine tasks, nice-to-have features
- **Level 2**: Regular work, standard features
- **Level 3**: Important tasks, high-value features
- **Level 4**: Critical issues, urgent problems

### 2. Leverage Due Dates Strategically

- Set realistic due dates
- Update due dates when priorities change
- Use due dates for time-sensitive tasks

### 3. Use Tags for Context

- `urgent`: Time-sensitive but not critical
- `critical`: Business-critical issues
- `blocker`: Blocking other work
- `review`: Ready for review

### 4. Regular Maintenance

- Update task status as you work
- Adjust priorities as circumstances change
- Archive completed tasks regularly

### 5. Daily Priority Review

Start each day with: `node cli.js top --show-scores`

This gives you a clear picture of what deserves your attention first.

## Next Steps

Now that you understand priority sorting, you might want to explore:

- **CSV Export**: Export priority-sorted tasks for reports
- **Statistics**: Analyze your task completion patterns
- **Tag Management**: Organize tasks with custom tags
- **Automation**: Create scripts for routine task management

## Quick Reference

| Command | Purpose | Example |
|---------|---------|---------|
| `top` | Show priority-sorted tasks | `node cli.js top -l 10 --show-scores` |
| `score <id>` | Check task score details | `node cli.js score abc123` |
| `priority <id> <level>` | Update task priority | `node cli.js priority abc123 4` |
| `due <id> <date>` | Update due date | `node cli.js due abc123 2026-02-15` |
| `tag <id> <tag>` | Add tag to task | `node cli.js tag abc123 urgent` |
| `status <id> <status>` | Update task status | `node cli.js status abc123 done` |

---

**Pro Tip**: Create a daily habit of checking `node cli.js top --show-scores` to stay focused on what matters most!
