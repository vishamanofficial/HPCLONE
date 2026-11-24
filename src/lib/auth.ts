import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { User, IUser } from '@/models/User';
import '@/models/Role';
import { AuditLog } from '@/models/AuditLog';
import { connectDB } from './db';
import { siteConfig } from '@/config/site';

const JWT_SECRET = process.env.JWT_SECRET || 'hp_jwt_super_secret_key_2026_change_in_production_9988776655';

export interface AuthenticatedUser extends IUser {
  roleDetails?: any;
  permissions?: string[];
}

export async function verifyAuth(req: NextRequest | Request): Promise<AuthenticatedUser | null> {
  try {
    const authHeader = req.headers.get('authorization') || '';
    if (!authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string; role?: string; permissions?: string[] };

    let user = null;
    try {
      await connectDB();
      user = await User.findById(decoded.id).populate('role');
    } catch {}

    if (!user) {
      const defaultEmail = (process.env.ADMIN_DEFAULT_EMAIL || siteConfig.emails.admin).toLowerCase();
      if (decoded.email?.toLowerCase() === defaultEmail) {
        return {
          _id: decoded.id || '673e1c9e89b2c3d4e5f60001',
          name: 'Aman (Super Admin)',
          email: defaultEmail,
          role: 'Super Admin',
          roleDetails: { name: 'Super Admin', permissions: ['*'] },
          permissions: ['*'],
          isActive: true
        } as any;
      }
      return null;
    }

    if (!user.isActive) {
      return null;
    }

    return user as any;
  } catch {
    return null;
  }
}

export function generateToken(user: any): string {
  return jwt.sign(
    { id: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export async function logActivity(
  user: any | null,
  action: string,
  resource: string,
  resourceId: any = '',
  details: string = '',
  req?: NextRequest | Request
): Promise<void> {
  try {
    await connectDB();
    const role = (user?.role as any)?.name || 'Public / System';
    const userAgent = req?.headers.get('user-agent') || '';
    const ip = req?.headers.get('x-forwarded-for') || '';

    await AuditLog.create({
      userId: user?._id,
      userName: user?.name || 'Public / System',
      userRole: role,
      action,
      resource,
      resourceId: resourceId ? String(resourceId) : '',
      details,
      ipAddress: ip,
      userAgent: userAgent
    });
  } catch (err) {
    console.error('[AuditLog] Failed to record activity:', err);
  }
}
