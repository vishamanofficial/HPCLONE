import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';
import { Role, IRole } from '../models/Role.js';

export interface AuthRequest extends Request {
  user?: IUser & { roleDetails?: IRole };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Authentication required. No token provided.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'hp_jwt_super_secret_key_2026_change_in_production_9988776655';

    const decoded = jwt.verify(token, secret) as { id: string; email: string };
    const user = await User.findById(decoded.id).populate('role');

    if (!user || !user.isActive) {
      res.status(401).json({ success: false, message: 'User account not found or deactivated.' });
      return;
    }

    req.user = user as any;
    next();
  } catch (error: any) {
    res.status(401).json({ success: false, message: 'Invalid or expired session token.' });
  }
};
