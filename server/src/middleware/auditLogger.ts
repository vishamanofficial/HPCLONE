import { Request } from 'express';
import { AuditLog } from '../models/AuditLog.js';
import { AuthRequest } from './auth.js';

export const logActivity = async (
  req: Request | AuthRequest,
  action: string,
  resource: string,
  resourceId: any = '',
  details: string = ''
): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const user = authReq.user;
    const role = (user?.role as any)?.name || 'System';

    await AuditLog.create({
      userId: user?._id,
      userName: user?.name || 'Public / System',
      userRole: role,
      action,
      resource,
      resourceId: resourceId ? String(resourceId) : '',
      details,
      ipAddress: req.ip || req.socket.remoteAddress || '',
      userAgent: req.get('user-agent') || ''
    });
  } catch (error) {
    console.error('[AuditLog] Failed to record activity:', error);
  }
};
