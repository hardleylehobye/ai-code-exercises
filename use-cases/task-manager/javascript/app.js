// app.js
const { Task, TaskPriority, TaskStatus } = require('./models');
const { TaskStorage } = require('./storage');

class TaskManager {
  constructor(storagePath = 'tasks.json') {
    this.storage = new TaskStorage(storagePath);
  }

  createTask(title, description = "", priorityValue = 2, dueDateStr = null, tags = []) {
    const priority = priorityValue;
    let dueDate = null;

    if (dueDateStr) {
      try {
        dueDate = new Date(dueDateStr);
        if (isNaN(dueDate.getTime())) {
          throw new Error("Invalid date");
        }
      } catch (error) {
        console.error("Invalid date format. Use YYYY-MM-DD");
        return null;
      }
    }

    const task = new Task(title, description, priority, dueDate, tags);
    const taskId = this.storage.addTask(task);
    return taskId;
  }

  listTasks(statusFilter = null, priorityFilter = null, showOverdue = false) {
    if (showOverdue) {
      return this.storage.getOverdueTasks();
    }

    if (statusFilter) {
      return this.storage.getTasksByStatus(statusFilter);
    }

    if (priorityFilter) {
      return this.storage.getTasksByPriority(parseInt(priorityFilter));
    }

    return this.storage.getAllTasks();
  }

  updateTaskStatus(taskId, newStatusValue) {
    if (newStatusValue === TaskStatus.DONE) {
      const task = this.storage.getTask(taskId);
      if (task) {
        task.markAsDone();
        this.storage.save();
        return true;
      }
      return false;
    } else {
      return this.storage.updateTask(taskId, { status: newStatusValue });
    }
  }

  updateTaskPriority(taskId, newPriorityValue) {
    return this.storage.updateTask(taskId, { priority: parseInt(newPriorityValue) });
  }

  updateTaskDueDate(taskId, dueDateStr) {
    try {
      const dueDate = new Date(dueDateStr);
      if (isNaN(dueDate.getTime())) {
        throw new Error("Invalid date");
      }
      return this.storage.updateTask(taskId, { dueDate });
    } catch (error) {
      console.error("Invalid date format. Use YYYY-MM-DD");
      return false;
    }
  }

  deleteTask(taskId) {
    return this.storage.deleteTask(taskId);
  }

  getTaskDetails(taskId) {
    return this.storage.getTask(taskId);
  }

  addTagToTask(taskId, tag) {
    const task = this.storage.getTask(taskId);
    if (task) {
      if (!task.tags.includes(tag)) {
        task.tags.push(tag);
        this.storage.save();
      }
      return true;
    }
    return false;
  }

  removeTagFromTask(taskId, tag) {
    const task = this.storage.getTask(taskId);
    if (task && task.tags.includes(tag)) {
      task.tags = task.tags.filter(t => t !== tag);
      this.storage.save();
      return true;
    }
    return false;
  }

  getStatistics() {
    const tasks = this.storage.getAllTasks();
    const total = tasks.length;

    // Count by status
    const statusCounts = Object.values(TaskStatus).reduce((acc, status) => {
      acc[status] = 0;
      return acc;
    }, {});

    tasks.forEach(task => {
      statusCounts[task.status]++;
    });

    // Count by priority
    const priorityCounts = Object.values(TaskPriority).reduce((acc, priority) => {
      acc[priority] = 0;
      return acc;
    }, {});

    tasks.forEach(task => {
      priorityCounts[task.priority]++;
    });

    // Count overdue
    const overdueTasks = tasks.filter(task => task.isOverdue());

    // Count completed in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const completedRecently = tasks.filter(task =>
      task.completedAt && task.completedAt >= sevenDaysAgo
    );

    return {
      total,
      byStatus: statusCounts,
      byPriority: priorityCounts,
      overdue: overdueTasks.length,
      completedLastWeek: completedRecently.length
    };
  }

  exportTasks(filePath = 'tasks.csv', filters = {}) {
    try {
      const exportedCount = this.storage.exportToCSV(filePath, filters);
      return exportedCount;
    } catch (error) {
      console.error(`Failed to export tasks: ${error.message}`);
      throw error;
    }
  }

  calculateTaskScore(task, currentUserId = null) {
    // Consistent priority weights across implementations
    const priorityWeights = {
      [TaskPriority.LOW]: 1,
      [TaskPriority.MEDIUM]: 2,
      [TaskPriority.HIGH]: 4,
      [TaskPriority.URGENT]: 6
    };

    // Calculate base score from priority (multiplied by 10 for dominance)
    let score = (priorityWeights[task.priority] || 0) * 10;

    // Add due date factor (higher score for tasks due sooner)
    if (task.dueDate) {
      const now = new Date();
      const dueDate = new Date(task.dueDate);
      const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

      if (daysUntilDue < 0) {  // Overdue tasks
        score += 35;
      } else if (daysUntilDue === 0) {  // Due today
        score += 20;
      } else if (daysUntilDue <= 2) {  // Due in next 2 days
        score += 15;
      } else if (daysUntilDue <= 7) {  // Due in next week
        score += 10;
      }
    }

    // Reduce score for tasks that are completed or in review
    if (task.status === TaskStatus.DONE) {
      score -= 50;
    } else if (task.status === TaskStatus.REVIEW) {
      score -= 15;
    }

    // Boost score for tasks with certain tags
    if (task.tags && task.tags.some(tag => ["blocker", "critical", "urgent"].includes(tag))) {
      score += 8;
    }

    // Boost score for recently updated tasks
    if (task.updatedAt) {
      const now = new Date();
      const updatedAt = new Date(task.updatedAt);
      const daysSinceUpdate = Math.floor((now - updatedAt) / (1000 * 60 * 60 * 24));
      if (daysSinceUpdate < 1) {
        score += 5;
      }
    }

    // Boost score for tasks assigned to the current user
    if (currentUserId && task.assignedTo === currentUserId) {
      score += 12;
    }

    // Ensure minimum score of 0 to prevent negative scores
    return Math.max(0, score);
  }

  sortTasksByImportance(tasks, currentUserId = null) {
    // Create a copy of tasks array to avoid modifying original
    return [...tasks].sort((a, b) => {
      return this.calculateTaskScore(b, currentUserId) - this.calculateTaskScore(a, currentUserId);
    });
  }

  getTopPriorityTasks(tasks, limit = 5, currentUserId = null) {
    const sortedTasks = this.sortTasksByImportance(tasks, currentUserId);
    return sortedTasks.slice(0, limit);
  }
}

module.exports = { TaskManager };
