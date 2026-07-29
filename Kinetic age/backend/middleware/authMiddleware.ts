import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';
import { dbStore } from '../database/store';
import { ApiError } from '../utils/apiResponse';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
  };
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  let token: string | undefined;

  // 1. Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return next(new ApiError(401, 'Authentication required. Please log in.'));
  }

  try {
    const decoded = verifyToken(token);
    let user = dbStore.findUserById(decoded.id);

    if (!user && decoded.email) {
      user = dbStore.findUserByEmail(decoded.email);
    }

    if (!user && decoded.email) {
      // Re-create memory session if dev server restarted
      user = dbStore.createUser({
        name: decoded.email.split('@')[0],
        email: decoded.email.toLowerCase(),
        passwordHash: '',
        role: decoded.role || 'user',
      });
    }

    if (!user) {
      return next(new ApiError(401, 'Invalid user session or user no longer exists.'));
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    next();
  } catch (error) {
    return next(new ApiError(401, 'Token expired or invalid signature. Please log in again.'));
  }
};
