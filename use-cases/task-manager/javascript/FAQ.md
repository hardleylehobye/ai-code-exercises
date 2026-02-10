# Task Manager CLI - Frequently Asked Questions

## Getting Started

### What is Task Manager CLI?
Task Manager CLI is a command-line task management tool designed for developers and power users who prefer working in the terminal. It provides intelligent task prioritization, flexible filtering, and data export capabilities.

### How do I install Task Manager CLI?
```bash
# Clone the repository
git clone https://github.com/yourusername/task-manager-cli.git
cd task-manager-cli/use-cases/task-manager/javascript

# Install dependencies
npm install

# Verify installation
node cli.js --help
```

### What are the system requirements?
- Node.js 14.0 or higher
- npm or yarn package manager
- About 10MB of disk space for the application and data

### How do I get started after installation?
1. Create your first task: `node cli.js create "My first task"`
2. View all tasks: `node cli.js list`
3. Check priority sorting: `node cli.js top`
4. View statistics: `node cli.js stats`

### Where are my tasks stored?
Tasks are stored in a `tasks.json` file in the same directory as the CLI script. This makes it easy to backup or migrate your data.

## Basic Usage

### How do I create a new task?
```bash
# Simple task
node cli.js create "Task description"

# Advanced task with all options
node cli.js create "Task title" -d "Description" -p 3 -u 2026-02-15 -t "tag1,tag2"
```

### How do I view my tasks?
```bash
# List all tasks
node cli.js list

# Show priority-sorted tasks
node cli.js top

# View specific task details
node cli.js show <task-id>
```

### How do I mark a task as complete?
```bash
node cli.js status <task-id> done
```

### Can I edit a task after creating it?
Yes, you can update various aspects:
```bash
# Update priority
node cli.js priority <task-id> 4

# Update due date
node cli.js due <task-id> 2026-02-20

# Update status
node cli.js status <task-id> in_progress

# Add tags
node cli.js tag <task-id> urgent
```

### How do I delete a task?
```bash
node cli.js delete <task-id>
```

## Priority and Sorting

### How does the priority scoring work?
The algorithm considers multiple factors:
- **Base Priority**: Level 1-4 (multiplied by 10)
- **Due Date**: Overdue (+35), due today (+20), due in 2 days (+15), due in week (+10)
- **Status**: Done (-50), Review (-15)
- **Special Tags**: "urgent", "critical", "blocker" (+8 each)
- **Recent Updates**: Updated within last day (+5)

### Why is my completed task still showing in priority list?
Completed tasks get a -50 penalty, which usually removes them from the top list. If you still see them, they might have very high base priority or multiple special tags.

### What do the priority levels mean?
- **Level 1 (Low)**: Routine tasks, nice-to-have items
- **Level 2 (Medium)**: Regular work, standard priority (default)
- **Level 3 (High)**: Important tasks, should be done soon
- **Level 4 (Urgent)**: Critical tasks, immediate attention required

### How can I see the score calculation for a task?
```bash
node cli.js score <task-id>
```

This shows the total score and all contributing factors.

### Why do two tasks with the same priority have different scores?
The scoring considers more than just priority. Check for:
- Different due dates
- Different tags (especially "urgent", "critical", "blocker")
- Different statuses
- Different update times

## Tags and Organization

### What are tags and how do I use them?
Tags help you categorize and filter tasks:
```bash
# Create task with tags
node cli.js create "Fix bug" -t "urgent,backend"

# Add tags to existing task
node cli.js tag <task-id> frontend

# Remove tags
node cli.js untag <task-id> old-tag
```

### Can I use any tag name?
Yes, you can use any tag name. However, "urgent", "critical", and "blocker" give special priority boosts.

### How do I find tasks with specific tags?
Currently, you need to use the export function:
```bash
node cli.js export tagged-tasks.csv
# Then filter the CSV file for your tags
```

### What's the difference between tags and priority?
- **Priority**: A 1-4 scale that affects task importance
- **Tags**: Flexible labels for categorization and context
- **Special tags**: Some tags ("urgent", "critical", "blocker") also boost priority scores

## Due Dates and Time Management

### How do I set due dates?
```bash
# When creating a task
node cli.js create "Task" -u 2026-02-15

# For existing task
node cli.js due <task-id> 2026-02-15
```

### What date format should I use?
Use YYYY-MM-DD format: `2026-02-15`, `2026-12-31`, etc.

### What happens if a task is overdue?
Overdue tasks get +35 priority points, making them appear at the top of your priority list.

### Can I set reminders or notifications?
Currently, the CLI doesn't have built-in notifications. You can check overdue tasks with:
```bash
node cli.js list --overdue
```

### How do I handle tasks without due dates?
Tasks without due dates don't get due date points but are still sorted by priority and other factors.

## Data Management

### How do I backup my tasks?
Simply copy the `tasks.json` file:
```bash
cp tasks.json tasks-backup-$(date +%Y%m%d).json
```

### Can I export my tasks to other formats?
Yes, you can export to CSV:
```bash
# Export all tasks
node cli.js export

# Export with filters
node cli.js export --status todo --priority 4 important-tasks.csv
```

### How do I import tasks from another system?
Currently, there's no direct import function. You would need to:
1. Export from the other system to CSV/JSON
2. Write a script to convert the format
3. Manually add tasks using the CLI

### Can I use Task Manager CLI on multiple computers?
Yes, by syncing the `tasks.json` file between computers using:
- Cloud storage (Dropbox, Google Drive, etc.)
- Git repository
- File sharing services

### What happens if my tasks.json file gets corrupted?
Try these steps:
1. Restore from backup if you have one
2. Try to validate the JSON: `node -e "JSON.parse(require('fs').readFileSync('tasks.json'))"`
3. If corrupted, you might need to manually fix the JSON or start fresh

## Troubleshooting

### Command not found errors
**Problem**: `node: command not found` or similar errors.

**Solution**:
1. Verify Node.js installation: `node --version`
2. Check you're in the right directory: `cd path/to/task-manager/javascript`
3. Use full path to Node.js if needed

### Permission denied errors
**Problem**: Cannot create or modify `tasks.json`.

**Solution**:
1. Check directory permissions: `ls -la`
2. Change directory if needed: `cd ~/my-tasks`
3. Ensure write permissions: `chmod u+w .`

### Tasks not appearing in list
**Problem**: Created tasks don't show up.

**Solution**:
1. Check if tasks.json was created: `ls -la tasks.json`
2. Verify task creation succeeded (no error messages)
3. Try listing all tasks: `node cli.js list`

### Priority sorting seems wrong
**Problem**: Tasks aren't sorted as expected.

**Solution**:
1. Check individual scores: `node cli.js score <task-id>`
2. Verify all scoring factors (priority, due date, tags, status)
3. Remember completed tasks get heavy penalties

### Performance issues with many tasks
**Problem**: Commands are slow with hundreds of tasks.

**Solution**:
1. Export and archive old tasks: `node cli.js export --status done old.csv`
2. Delete old completed tasks manually
3. Use limits: `node cli.js top -l 10`

## Advanced Features

### Can I customize the priority scoring algorithm?
Yes, you can modify the `calculateTaskScore` function in `app.js`. The scoring factors and weights are clearly documented.

### How do I integrate with other tools?
- **Git**: Use task IDs in commit messages
- **Editors**: Create editor shortcuts for common commands
- **Scripts**: Write shell scripts for routine operations

### Is there an API or programmatic interface?
While there's no REST API, you can import and use the classes directly:
```javascript
const { TaskManager } = require('./app');
const taskManager = new TaskManager();
const tasks = taskManager.getAllTasks();
```

### Can I add custom commands?
Yes, edit `cli.js` to add new commands following the existing pattern with Commander.js.

## Statistics and Reporting

### What statistics are available?
```bash
node cli.js stats
```

Shows:
- Total task count
- Tasks by status (todo, in_progress, review, done)
- Tasks by priority level
- Overdue task count
- Tasks completed in last 7 days

### How can I track my productivity?
- Use the statistics command regularly
- Export data to CSV for deeper analysis
- Monitor the "completed in last 7 days" metric
- Track overdue task trends

### Can I generate reports?
Export to CSV and use spreadsheet software or data analysis tools to create custom reports and charts.

## Configuration and Customization

### Can I change the storage location?
Yes, modify the TaskManager constructor in `app.js`:
```javascript
const taskManager = new TaskManager('/path/to/custom/tasks.json');
```

### Can I customize the date format?
The date format is hardcoded in several places. You would need to modify the display functions in `cli.js` and the date parsing in `app.js`.

### How do I change the default priority level?
Modify the default priority in the Task constructor in `models.js`:
```javascript
constructor(title, description = '', priority = TaskPriority.MEDIUM, dueDate = null, tags = []) {
```

## Best Practices

### How should I organize my tasks?
1. **Use priorities consistently**: Reserve level 4 for truly urgent items
2. **Set realistic due dates**: Update them when circumstances change
3. **Use tags strategically**: Create a consistent tagging system
4. **Regular maintenance**: Update status and archive completed tasks

### What's a good workflow?
1. **Morning**: Check `node cli.js top --show-scores`
2. **During work**: Update task status as you progress
3. **Evening**: Complete tasks and plan tomorrow
4. **Weekly**: Review statistics and archive old tasks

### How many tasks should I have active?
Aim for 10-20 active tasks. Too many can be overwhelming; consider archiving completed or low-priority items.

## Integration and Automation

### Can I use this with project management tools?
Yes, you can export data and import it into other tools, or build custom integration scripts.

### How do I handle recurring tasks?
Create a script that duplicates tasks with new due dates, or manually recreate them using templates.

### Can I set up automated backups?
Create a cron job or scheduled task to copy `tasks.json` regularly:
```bash
# Add to crontab for daily backup
0 0 * * * cp /path/to/tasks.json /path/to/backups/tasks-$(date +\%Y\%m\%d).json
```

## Support and Community

### Where can I get help?
- **Documentation**: This README and guide files
- **Issues**: GitHub repository issues page
- **Discussions**: GitHub discussions for questions

### How do I report bugs?
1. Check existing issues first
2. Create a new issue with:
   - Command that failed
   - Error message
   - Steps to reproduce
   - Your environment (Node.js version, OS)

### How can I contribute?
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

**Still have questions?** Check the full documentation or open an issue on GitHub!
