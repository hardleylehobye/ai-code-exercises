// Part 4: Integration test – full workflow
// calculateTaskScore → sortTasksByImportance → getTopPriorityTasks

const { describe, it } = require('node:test');
const assert = require('node:assert');
const { TaskManager } = require('../app');
const { TaskPriority, TaskStatus } = require('../models');

const taskManager = new TaskManager('tasks.json');

const MS_PER_DAY = 1000 * 60 * 60 * 24;

describe('Integration: task priority workflow', () => {
  it('sortTasksByImportance returns new array in descending score order', () => {
    const low = {
      priority: TaskPriority.LOW,
      status: TaskStatus.TODO,
      dueDate: null,
      tags: [],
      updatedAt: null,
      id: 'low'
    };
    const urgent = {
      priority: TaskPriority.URGENT,
      status: TaskStatus.TODO,
      dueDate: null,
      tags: [],
      updatedAt: null,
      id: 'urgent'
    };
    const tasks = [low, urgent];
    const sorted = taskManager.sortTasksByImportance(tasks);
    assert.notStrictEqual(sorted, tasks, 'should not mutate original array');
    assert.strictEqual(sorted.length, 2);
    assert.strictEqual(sorted[0].id, 'urgent', 'highest score first');
    assert.strictEqual(sorted[1].id, 'low');
  });

  it('getTopPriorityTasks returns at most limit items in correct order', () => {
    const tasks = [
      { priority: TaskPriority.LOW, status: TaskStatus.TODO, dueDate: null, tags: [], updatedAt: null, id: 'a' },
      { priority: TaskPriority.URGENT, status: TaskStatus.TODO, dueDate: null, tags: [], updatedAt: null, id: 'b' },
      { priority: TaskPriority.MEDIUM, status: TaskStatus.TODO, dueDate: null, tags: [], updatedAt: null, id: 'c' }
    ];
    const top = taskManager.getTopPriorityTasks(tasks, 2);
    assert.strictEqual(top.length, 2);
    assert.strictEqual(top[0].id, 'b');
    assert.strictEqual(top[1].id, 'c');
  });

  it('getTopPriorityTasks with limit > length returns all tasks in order', () => {
    const tasks = [
      { priority: TaskPriority.HIGH, status: TaskStatus.TODO, dueDate: null, tags: [], updatedAt: null, id: 'x' },
      { priority: TaskPriority.LOW, status: TaskStatus.TODO, dueDate: null, tags: [], updatedAt: null, id: 'y' }
    ];
    const top = taskManager.getTopPriorityTasks(tasks, 10);
    assert.strictEqual(top.length, 2);
    assert.strictEqual(top[0].id, 'x');
    assert.strictEqual(top[1].id, 'y');
  });

  it('getTopPriorityTasks with limit 0 returns empty array', () => {
    const tasks = [
      { priority: TaskPriority.MEDIUM, status: TaskStatus.TODO, dueDate: null, tags: [], updatedAt: null, id: 'z' }
    ];
    const top = taskManager.getTopPriorityTasks(tasks, 0);
    assert.strictEqual(top.length, 0);
  });

  it('full workflow: scores, order, and top-N match expectations', () => {
    const now = Date.now();
    const overdue = new Date(now - MS_PER_DAY);
    const dueInWeek = new Date(now + MS_PER_DAY * 5);

    const tasks = [
      { priority: TaskPriority.LOW, status: TaskStatus.TODO, dueDate: null, tags: [], updatedAt: null, id: '1' },
      { priority: TaskPriority.URGENT, status: TaskStatus.TODO, dueDate: overdue, tags: ['critical'], updatedAt: new Date(now - 1000 * 60), id: '2' },
      { priority: TaskPriority.MEDIUM, status: TaskStatus.DONE, dueDate: dueInWeek, tags: [], updatedAt: null, id: '3' }
    ];

    const sorted = taskManager.sortTasksByImportance(tasks);
    assert.strictEqual(sorted[0].id, '2', 'URGENT + overdue + critical + recent update should rank first');
    assert.strictEqual(sorted[1].id, '1', 'LOW todo second');
    assert.strictEqual(sorted[2].id, '3', 'DONE last');

    const top = taskManager.getTopPriorityTasks(tasks, 2);
    assert.strictEqual(top.length, 2);
    assert.strictEqual(top[0].id, '2');
    assert.strictEqual(top[1].id, '1');
  });

  it('workflow with currentUser: assigned-to-me task ranks higher', () => {
    const currentUser = 'me';
    const tasks = [
      { priority: TaskPriority.MEDIUM, status: TaskStatus.TODO, dueDate: null, tags: [], updatedAt: null, assignedTo: 'other', id: 'a' },
      { priority: TaskPriority.MEDIUM, status: TaskStatus.TODO, dueDate: null, tags: [], updatedAt: null, assignedTo: currentUser, id: 'b' }
    ];
    const top = taskManager.getTopPriorityTasks(tasks, 2, currentUser);
    assert.strictEqual(top[0].id, 'b', 'task assigned to current user gets +12 and wins');
    assert.strictEqual(top[1].id, 'a');
  });
});
