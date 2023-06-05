const express = require('express');
const connectDB = require('./db');
const userRoutes = require('./routes/users');
const taskRoutes = require('./routes/tasks');

const app = express();

// Підключення до бази даних
connectDB();

// Парсер JSON
app.use(express.json());

// Маршрути для користувачів та завдань
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// Запуск сервера
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});