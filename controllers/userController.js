const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Перевірка, чи користувач з такою електронною адресою вже існує
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Хешування пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Створення нового користувача
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({newUser});
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user' });
  }
};

// Отримання всіх користувачів
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get users' });
  }
};

// Отримання користувача за ідентифікатором
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user' });
  }
};

// Оновлення користувача
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Перевірка, чи користувач з таким ідентифікатором існує
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Хешування нового пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Оновлення користувача
    user.name = name;
    user.email = email;
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({user});
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user' });
  }
};

// Видалення користувача
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({user});
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Перевірка, чи існує користувач з такою електронною поштою
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Перевірка правильності введеного пароля
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    // Створення JWT токена
    const token = jwt.sign({ userId: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Authorization error' });
  }
};

// Профіль користувача
exports.getProfile = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token is not given' });
    }
    
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    
    const userId = decodedToken.userId;

    // Отримання користувача з бази даних
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Failed to open user`s profile' });
  }
};