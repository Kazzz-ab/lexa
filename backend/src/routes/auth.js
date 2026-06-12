import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import prisma, { withId } from '../lib/prisma.js';
import { protect } from '../middleware/auth.js';
import { sendPasswordReset } from '../lib/email.js';

const router = Router();

const signToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });
    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { name, email, password: hashed, role: 'paralegal' } });
    res.status(201).json({ token: signToken(user), user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) { next(err); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    res.json({ token: signToken(user), user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) { next(err); }
});

router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(withId(user));
  } catch (err) { next(err); }
});

router.put('/me', protect, async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, email },
      select: { id: true, name: true, email: true, role: true },
    });
    res.json(withId(user));
  } catch (err) { next(err); }
});

router.put('/password', protect, async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) return res.status(400).json({ message: 'New password must be at least 8 characters' });
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }
    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: req.user.id }, data: { password: hashed } });
    res.json({ message: 'Password updated' });
  } catch (err) { next(err); }
});

router.post('/forgot-password', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.json({ message: 'If that email exists, a reset link has been sent' });
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 3600000);
    await prisma.user.update({ where: { id: user.id }, data: { resetToken: token, resetTokenExpiry: expiry } });
    const resetUrl = `${process.env.CLIENT_ORIGIN || 'http://localhost:5174'}/reset-password?token=${token}`;
    await sendPasswordReset(user.email, resetUrl);
    res.json({ message: 'If that email exists, a reset link has been sent' });
  } catch (err) { next(err); }
});

router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: 'Token and new password are required' });
    if (newPassword.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters' });
    const user = await prisma.user.findFirst({
      where: { resetToken: token, resetTokenExpiry: { gte: new Date() } },
    });
    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });
    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed, resetToken: null, resetTokenExpiry: null },
    });
    res.json({ message: 'Password reset successfully' });
  } catch (err) { next(err); }
});

export default router;
