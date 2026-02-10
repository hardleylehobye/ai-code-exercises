// Part 2: Unit tests for calculateTaskScore
// Exercise 2.1: Basic test → improved test
// Exercise 2.2: Due date calculation tests

const { describe, it } = require('node:test');
const assert = require('node:assert');
const { TaskManager } = require('../app');
const { TaskPriority, TaskStatus } = require('../models');

// Use a TaskManager with a dummy storage path (we only call calculateTaskScore)
const taskManager = new TaskManager('tasks.json');

// --- Exercise 2.1: Basic test (intentionally simple) ---
describe('calculateTaskScore - basic functionality', () => {
  it('returns a positive score for a medium-priority todo task', () => {
    const task = {
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      dueDate: null,
      tags: [],
      updatedAt: null
    };
    const score = taskManager.calculateTaskScore(task);
    assert.strictEqual(score, 20, 'MEDIUM priority gives base score 2*10=20');
  });
});

// --- Exercise 2.1 improved: Clear purpose, behavior-focused, precise assertions ---
describe('calculateTaskScore - priority base score (behavior)', () => {
  const minimalTask = (priority) => ({
    priority,
    status: TaskStatus.TODO,
    dueDate: null,
    tags: [],
    updatedAt: null
  });

  it('LOW priority gives base score 10', () => {
    assert.strictEqual(taskManager.calculateTaskScore(minimalTask(TaskPriority.LOW)), 10);
  });

  it('MEDIUM priority gives base score 20', () => {
    assert.strictEqual(taskManager.calculateTaskScore(minimalTask(TaskPriority.MEDIUM)), 20);
  });

  it('HIGH priority gives base score 40', () => {
    assert.strictEqual(taskManager.calculateTaskScore(minimalTask(TaskPriority.HIGH)), 40);
  });

  it('URGENT priority gives base score 60', () => {
    assert.strictEqual(taskManager.calculateTaskScore(minimalTask(TaskPriority.URGENT)), 60);
  });

  it('unknown priority is treated as 0 (no base score)', () => {
    assert.strictEqual(taskManager.calculateTaskScore(minimalTask(99)), 0);
  });
});

// --- Exercise 2.2: Due date calculation ---
describe('calculateTaskScore - due date calculation', () => {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  function taskWithDueDate(daysFromNow) {
    const due = new Date(Date.now() + daysFromNow * MS_PER_DAY);
    return {
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      dueDate: due,
      tags: [],
      updatedAt: null
    };
  }

  it('adds 35 when task is overdue (due in the past)', () => {
    const task = taskWithDueDate(-2);
    const score = taskManager.calculateTaskScore(task);
    assert.strictEqual(score, 20 + 35, 'base 20 + overdue 35 = 55');
  });

  it('adds 20 when task is due today', () => {
    const task = taskWithDueDate(0);
    const score = taskManager.calculateTaskScore(task);
    assert.strictEqual(score, 20 + 20, 'base 20 + due today 20 = 40');
  });

  it('adds 15 when task is due in 1 or 2 days', () => {
    const task1 = taskWithDueDate(1);
    const task2 = taskWithDueDate(2);
    assert.strictEqual(taskManager.calculateTaskScore(task1), 20 + 15);
    assert.strictEqual(taskManager.calculateTaskScore(task2), 20 + 15);
  });

  it('adds 10 when task is due in 3–7 days', () => {
    const task = taskWithDueDate(5);
    const score = taskManager.calculateTaskScore(task);
    assert.strictEqual(score, 20 + 10, 'base 20 + within week 10 = 30');
  });

  it('adds 0 when task is due more than 7 days from now', () => {
    const task = taskWithDueDate(10);
    const score = taskManager.calculateTaskScore(task);
    assert.strictEqual(score, 20, 'only base score');
  });

  it('adds no due-date bonus when dueDate is null', () => {
    const task = {
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      dueDate: null,
      tags: [],
      updatedAt: null
    };
    assert.strictEqual(taskManager.calculateTaskScore(task), 20);
  });
});

// --- Status penalties ---
describe('calculateTaskScore - status penalties', () => {
  const baseTask = {
    priority: TaskPriority.MEDIUM,
    status: TaskStatus.TODO,
    dueDate: null,
    tags: [],
    updatedAt: null
  };

  it('DONE status reduces score by 50', () => {
    const task = { ...baseTask, status: TaskStatus.DONE };
    assert.strictEqual(taskManager.calculateTaskScore(task), 0, '20 - 50 = 0 (floored)');
  });

  it('REVIEW status reduces score by 15', () => {
    const task = { ...baseTask, status: TaskStatus.REVIEW };
    assert.strictEqual(taskManager.calculateTaskScore(task), 5);
  });
});

// --- Tags and recency ---
describe('calculateTaskScore - tags and recent update', () => {
  it('adds 8 when task has blocker, critical, or urgent tag', () => {
    const task = {
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      dueDate: null,
      tags: ['blocker'],
      updatedAt: null
    };
    assert.strictEqual(taskManager.calculateTaskScore(task), 20 + 8);
  });

  it('adds 5 when updated within last day', () => {
    const task = {
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      dueDate: null,
      tags: [],
      updatedAt: new Date(Date.now() - 1000 * 60 * 30) // 30 min ago
    };
    assert.strictEqual(taskManager.calculateTaskScore(task), 20 + 5);
  });

  it('minimum score is 0', () => {
    const task = {
      priority: TaskPriority.LOW,
      status: TaskStatus.DONE,
      dueDate: null,
      tags: [],
      updatedAt: null
    };
    assert.strictEqual(taskManager.calculateTaskScore(task), 0);
  });
});
