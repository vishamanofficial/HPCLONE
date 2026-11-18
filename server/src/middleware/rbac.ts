import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.js';

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const userRole = (req.user.role as any)?.name || '';
    if (roles.includes(userRole) || userRole === 'Super Admin') {
      next();
      return;
    }

    res.status(403).json({
      success: false,
      message: `Access denied. Requires one of roles: ${roles.join(', ')}`
    });
  };
};

export const requirePermission = (permission: string) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const role = req.user.role as any;
    const permissions: string[] = role?.permissions || [];
    const roleName = role?.name;

    if (roleName === 'Super Admin' || permissions.includes(permission) || permissions.includes('*')) {
      next();
      return;
    }

    res.status(403).json({
      success: false,
      message: `Access denied. Requires permission: ${permission}`
    });
  };
};
