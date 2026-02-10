# Task Manager CLI

A powerful command-line task management tool designed for developers who prefer to stay in the terminal. Manage your tasks with intelligent priority sorting, flexible filtering, and seamless data export capabilities.

![Task Manager CLI](https://img.shields.io/badge/Node.js-14%2B-green) ![License](https://img.shields.io/badge/license-MIT-blue) ![Version](https://img.shields.io/badge/version-1.0.0-orange)

## Features

- **Intelligent Task Management**: Create, update, and track tasks with rich metadata
- **Priority-Based Sorting**: Advanced scoring algorithm that considers priority, due dates, status, tags, and recency
- **Flexible Filtering**: Filter tasks by status, priority level, or overdue status
- **Data Export**: Export tasks to CSV with customizable filtering options
- **Tag System**: Organize tasks with custom tags for better categorization
- **Statistics Dashboard**: Get insights into your task completion patterns
- **Command-Line Interface**: Clean, intuitive CLI built with Commander.js
- **JSON Storage**: Lightweight file-based persistence with automatic backup

## Technologies Used

- **Node.js** - JavaScript runtime environment
- **Commander.js** - Command-line interface framework
- **UUID** - Unique identifier generation
- **CommonJS** - Module system

## Installation

### Prerequisites

- Node.js 14.0 or higher
- npm or yarn package manager

### Quick Install

1. Clone the repository:
```bash
git clone https://github.com/yourusername/task-manager-cli.git
cd task-manager-cli/use-cases/task-manager/javascript
```

2. Install dependencies:
```bash
npm install
```

3. Verify installation:
```bash
node cli.js --help
```

### Global Installation (Optional)

For system-wide access, you can link the package globally:
```bash
npm link
```

Then use the `task-manager` command instead of `node cli.js`.

## Quick Start

### Create Your First Task

```bash
# Create a simple task
node cli.js create "Complete project documentation"

# Create a task with priority and due date
node cli.js create "Fix critical bug" -p 4 -u 2026-02-15 -t "urgent,backend"

# Create a task with full details
node cli.js create "Design new feature" -d "Create mockups and user flow" -p 3 -u 2026-02-20 -t "design,frontend"
```

### View and Manage Tasks

```bash
# List all tasks
node cli.js list

# Show top priority tasks
node cli.js top --show-scores

# View task details
node cli.js show <task-id>

# Update task status
node cli.js status <task-id> in_progress

# Mark task as complete
node cli.js status <task-id> done
```

## Features Overview

### Task Creation and Management

Create tasks with rich metadata including priority levels, due dates, descriptions, and tags:

```bash
# Basic task creation
node cli.js create "Task title"

# Advanced task creation
node cli.js create "Task title" \
  -d "Task description" \
  -p 3 \
  -u 2026-02-15 \
  -t "tag1,tag2"
```

**Priority Levels:**
- `1` - Low priority
- `2` - Medium priority (default)
- `3` - High priority  
- `4` - Urgent priority

**Status Options:**
- `todo` - Default status for new tasks
- `in_progress` - Currently being worked on
- `review` - Ready for review
- `done` - Completed

### Intelligent Priority Sorting

The Task Manager uses a sophisticated scoring algorithm that considers multiple factors:

- **Base Priority** (×10 multiplier): Primary factor in scoring
- **Due Date Proximity**: Overdue (+35), due today (+20), due in 2 days (+15), due in week (+10)
- **Status Penalties**: Done (-50), Review (-15)
- **Tag Boosts**: "blocker", "critical", "urgent" tags (+8)
- **Recent Updates**: Updated within last day (+5)

```bash
# View top 5 priority tasks
node cli.js top

# View top 10 tasks with scores
node cli.js top -l 10 --show-scores

# Check score for specific task
node cli.js score <task-id>
```

### Advanced Filtering

Filter tasks based on various criteria:

```bash
# Filter by status
node cli.js list --status todo

# Filter by priority
node cli.js list --priority 4

# Show only overdue tasks
node cli.js list --overdue

# Combine filters
node cli.js list --status todo --priority 3
```

### Data Export

Export your tasks to CSV for analysis or sharing:

```bash
# Export all tasks
node cli.js export

# Export to specific file
node cli.js export my-tasks.csv

# Export with filters
node cli.js export --status todo --priority 4 urgent-tasks.csv

# Export only overdue tasks
node cli.js export --overdue overdue-report.csv
```

### Tag Management

Organize tasks with custom tags:

```bash
# Add tags to task
node cli.js tag <task-id> urgent

# Remove tags from task
node cli.js untag <task-id> old-tag

# Tasks support multiple tags
node cli.js create "Multi-tag task" -t "frontend,bug,urgent"
```

### Statistics and Insights

Get insights into your task management patterns:

```bash
# View comprehensive statistics
node cli.js stats
```

Statistics include:
- Total task count
- Tasks by status
- Tasks by priority level
- Overdue task count
- Tasks completed in last 7 days

## Configuration

The Task Manager uses a JSON file (`tasks.json`) for data storage. The file is automatically created in the same directory as the CLI script.

### Data Storage Location

By default, tasks are stored in `./tasks.json`. You can specify a different location by modifying the `TaskManager` constructor in `app.js`:

```javascript
const taskManager = new TaskManager('/path/to/your/tasks.json');
```

### Backup and Recovery

Since tasks are stored in JSON format, you can easily:

1. **Backup**: Copy the `tasks.json` file
2. **Migrate**: Move the file to a new location
3. **Inspect**: Open the file in any text editor to view raw data

## Command Reference

### Task Management

| Command | Description | Example |
|---------|-------------|---------|
| `create <title>` | Create new task | `node cli.js create "My task"` |
| `list` | List all tasks | `node cli.js list` |
| `show <id>` | Show task details | `node cli.js show abc123` |
| `delete <id>` | Delete task | `node cli.js delete abc123` |

### Task Updates

| Command | Description | Example |
|---------|-------------|---------|
| `status <id> <status>` | Update task status | `node cli.js status abc123 done` |
| `priority <id> <priority>` | Update task priority | `node cli.js priority abc123 4` |
| `due <id> <date>` | Update due date | `node cli.js due abc123 2026-02-15` |

### Tag Management

| Command | Description | Example |
|---------|-------------|---------|
| `tag <id> <tag>` | Add tag to task | `node cli.js tag abc123 urgent` |
| `untag <id> <tag>` | Remove tag from task | `node cli.js untag abc123 old-tag` |

### Advanced Features

| Command | Description | Example |
|---------|-------------|---------|
| `top` | Show priority tasks | `node cli.js top -l 10 --show-scores` |
| `score <id>` | Show task score | `node cli.js score abc123` |
| `stats` | Show statistics | `node cli.js stats` |
| `export [file]` | Export to CSV | `node cli.js export --status todo` |

## Troubleshooting

### Common Issues

#### "command not found" Error

**Problem**: `node: command not found` or similar errors.

**Solution**: 
1. Ensure Node.js is installed: `node --version`
2. Verify you're in the correct directory: `cd path/to/task-manager/javascript`
3. Use full path if needed: `node /path/to/cli.js create "Task"`

#### Permission Errors

**Problem**: Cannot create or modify `tasks.json` file.

**Solution**:
1. Check directory permissions: `ls -la`
2. Ensure write access: `chmod u+w .`
3. Try running from a different directory with write permissions

#### Task Data Corruption

**Problem**: `tasks.json` contains invalid JSON.

**Solution**:
1. Backup current file: `cp tasks.json tasks.json.backup`
2. Validate JSON: `node -e "console.log(JSON.parse(require('fs').readFileSync('tasks.json')))"`
3. If errors occur, manually fix JSON or restore from backup

#### Memory Issues with Large Task Lists

**Problem**: Slow performance with thousands of tasks.

**Solution**:
1. Export and archive old completed tasks: `node cli.js export --status done archive.csv`
2. Delete old tasks: Use script to remove completed tasks older than X days
3. Consider database implementation for very large datasets

### Debug Mode

Enable verbose output for troubleshooting:

```bash
# Add debug environment variable
DEBUG=1 node cli.js list
```

## Development

### Project Structure

```
javascript/
├── models.js          # Domain objects (Task, TaskPriority, TaskStatus)
├── storage.js          # JSON file persistence layer
├── app.js              # Business logic (TaskManager class)
├── cli.js              # Command-line interface
├── package.json        # Dependencies and project metadata
├── tasks.json          # Data storage (auto-generated)
└── README.md           # This file
```

### Adding New Commands

1. Add command to `cli.js`:
```javascript
program
  .command('new-command')
  .description('Command description')
  .action((args) => {
    // Implementation
  });
```

2. Add business logic to `app.js`:
```javascript
newCommand(args) {
  // Your implementation
}
```

3. Add data operations to `storage.js` if needed:
```javascript
newDataOperation(data) {
  // Storage implementation
}
```

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- Use 2 spaces for indentation
- Follow JavaScript Standard Style
- Add comments for complex logic
- Update documentation for new features

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

## Acknowledgments

- [Commander.js](https://github.com/tj/commander.js/) for excellent CLI framework
- [UUID](https://github.com/uuidjs/uuid) for unique identifier generation
- The Node.js community for inspiration and best practices

## Support

- 📖 **Documentation**: This README file
- 🐛 **Issues**: [GitHub Issues](https://github.com/yourusername/task-manager-cli/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/yourusername/task-manager-cli/discussions)

---

**Made with ❤️ for developers who love the command line**
