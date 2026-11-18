import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { AuthRequest } from '../middleware/auth.js';
import { logActivity } from '../middleware/auditLogger.js';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).populate('role');
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ success: false, message: 'Account is deactivated. Contact an administrator.' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    user.lastLogin = new Date();
    await user.save();

    const secret = process.env.JWT_SECRET || 'hp_jwt_super_secret_key_2026_change_in_production_9988776655';
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        role: (user.role as any)?.name
      },
      secret,
      { expiresIn: expiresIn as any }
    );

    await logActivity(req, 'LOGIN', 'auth', String(user._id), `User ${user.email} logged in`);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: (user.role as any)?.name,
        permissions: (user.role as any)?.permissions || [],
        avatar: user.avatar
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const user = await User.findById(req.user._id).populate('role').select('-passwordHash');
    res.json({
      success: true,
      user: {
        id: user?._id,
        name: user?.name,
        email: user?.email,
        role: (user?.role as any)?.name,
        permissions: (user?.role as any)?.permissions || [],
        avatar: user?.avatar,
        lastLogin: user?.lastLogin
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { name, currentPassword, newPassword, avatar } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (name) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;

    if (newPassword) {
      if (!currentPassword) {
        res.status(400).json({ success: false, message: 'Current password is required to change password' });
        return;
      }
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        res.status(400).json({ success: false, message: 'Current password is incorrect' });
        return;
      }
      const bcrypt = (await import('bcryptjs')).default;
      user.passwordHash = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    await logActivity(req, 'UPDATE_PROFILE', 'user', String(user._id), 'User profile updated');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
