// Part 3: TDD practice
// Exercise 3.1: TDD for "assigned to current user" +12 boost
// Exercise 3.2: TDD for "days since update" bug fix

const { describe, it } = require('node:test');
const assert = require('node:assert');
const { TaskManager } = require('../app');
const { TaskPriority, TaskStatus } = require('../models');

const taskManager = new TaskManager('tasks.json');

// --- Exercise 3.1: TDD for new feature - assigned to current user +12 ---
describe('TDD: assigned to current user gets +12 score boost', () => {
  const currentUser = 'user-123';

  it('task assigned to current user gets +12 boost', () => {
    const task = {
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      dueDate: null,
      tags: [],
      updatedAt: null,
      assignedTo: currentUser
    };
    const scoreWithUser = taskManager.calculateTaskScore(task, currentUser);
    const scoreWithoutUser = taskManager.calculateTaskScore(task);
    assert.strictEqual(scoreWithUser, 20 + 12, 'base 20 + assigned-to-me boost 12 = 32');
    assert.strictEqual(scoreWithoutUser, 20, 'no currentUser passed => no boost');
  });

  it('task assigned to someone else gets no boost when current user is passed', () => {
    const task = {
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      dueDate: null,
      tags: [],
      updatedAt: null,
      assignedTo: 'other-user'
    };
    const score = taskManager.calculateTaskScore(task, currentUser);
    assert.strictEqual(score, 20, 'assignedTo !== currentUser => no boost');
  });

  it('task with no assignedTo gets no boost', () => {
    const task = {
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      dueDate: null,
      tags: [],
      updatedAt: null
    };
    const score = taskManager.calculateTaskScore(task, currentUser);
    assert.strictEqual(score, 20);
  });
});

// --- Exercise 3.2: TDD for bug fix - days since update ---
// Bug: "days since update" must use full day conversion (ms -> days), not raw ms or seconds.
// Correct: daysSinceUpdate = (now - updatedAt) / (1000*60*60*24); boost only when daysSinceUpdate < 1.
describe('TDD: days since update calculation (regression)', () => {
  const MS_PER_DAY = 1000 * 60 * 60 * 24;

  it('no boost when task was updated more than 1 full day ago', () => {
    const task = {
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      dueDate: null,
      tags: [],
      updatedAt: new Date(Date.now() - MS_PER_DAY * 2) // 2 days ago
    };
    const score = taskManager.calculateTaskScore(task);
    assert.strictEqual(score, 20, 'updated 2 days ago => no +5; score stays 20');
  });

  it('boost when task was updated less than 1 day ago', () => {
    const task = {
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      dueDate: null,
      tags: [],
      updatedAt: new Date(Date.now() - MS_PER_DAY * 0.5) // 12 hours ago
    };
    const score = taskManager.calculateTaskScore(task);
    assert.strictEqual(score, 20 + 5, 'updated 12h ago => +5 recency boost');
  });

  it('no boost when updated exactly 1 day ago (boundary)', () => {
    const task = {
      priority: TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      dueDate: null,
      tags: [],
      updatedAt: new Date(Date.now() - MS_PER_DAY)
    };
    const score = taskManager.calculateTaskScore(task);
    assert.strictEqual(score, 20, 'daysSinceUpdate >= 1 => no boost');
  });
});
