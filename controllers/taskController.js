const Task = require('../models/Task');

// Створення завдання
exports.createTask = async (req, res) => {
  try {
    const { title, description, user } = req.body;
    // Створення нового завдання
    const newTask = new Task({ title, description, user });
    await newTask.save();

    res.status(201).json({newTask});
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task' });
  }
};

// Отримання всіх завдань
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('user');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get tasks' });
  }
};

// Отримання завдання за ідентифікатором
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('user');
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get task' });
  }
};

// Оновлення завдання
exports.updateTask = async (req, res) => {
  try {
    const { title, description, user } = req.body;

    // Перевірка, чи завдання з таким ідентифікатором існує
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Оновлення завдання
    task.title = title;
    task.description = description;
    task.user = user;
    await task.save();

    res.status(200).json({task});
  } catch (error) {
    res.status(500).json({ message: 'Failed to update task' });
  }
};

// Видалення завдання
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.status(200).json({task});
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task' });
  }
};