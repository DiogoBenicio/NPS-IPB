const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma');
const logger = require('../logger');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// Register admin (first time)
router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Check if any user exists
    const existingUser = await prisma.user.findFirst();
    if (existingUser) {
      logger.warn('auth_register_blocked', {
        reason: 'admin_already_exists',
        requestId: req.id,
      });
      return res.status(400).json({ error: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { username, password: hashedPassword },
    });

    res.json({ message: 'Admin registered' });
  } catch (error) {
    logger.error('auth_register_error', {
      message: error.message,
      stack: error.stack,
      requestId: req.id,
    });
    next(error);
  }
});

// Login
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await prisma.user.findUnique({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET);
    res.json({
      token,
      user: { id: user.id, username: user.username, role: user.role },
    });
  } catch (error) {
    logger.error('auth_login_error', {
      message: error.message,
      stack: error.stack,
      requestId: req.id,
    });
    next(error);
  }
});

// Debug: echo body and headers
router.post('/debug', (req, res) => {
  res.json({ body: req.body, headers: req.headers });
});

// Verificar se já existe algum usuário
router.get('/exists', async (req, res, next) => {
  try {
    const existingUser = await prisma.user.findFirst({ select: { id: true } });
    res.json({ hasUser: Boolean(existingUser) });
  } catch (error) {
    logger.error('auth_exists_error', {
      message: error.message,
      stack: error.stack,
      requestId: req.id,
    });
    next(error);
  }
});

module.exports = router;
