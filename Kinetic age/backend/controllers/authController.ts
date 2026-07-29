import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { dbStore } from '../database/store';
import { generateToken } from '../config/jwt';
import { ApiError, ApiResponse } from '../utils/apiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest } from '../middleware/authMiddleware';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role, phone, age, emergencyContact } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email, and password are required fields.');
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, 'Please provide a valid email address.');
  }

  if (password.length < 6) {
    throw new ApiError(400, 'Password must be at least 6 characters long.');
  }

  // Check duplicate email
  const existingUser = dbStore.findUserByEmail(email);
  if (existingUser) {
    throw new ApiError(409, 'An account with this email address already exists.');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = dbStore.createUser({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: role === 'admin' ? 'admin' : 'user',
    phone,
    age: age ? Number(age) : undefined,
    emergencyContact,
  });

  const token = generateToken({
    id: newUser.id,
    email: newUser.email,
    role: newUser.role,
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 3600 * 1000,
  });

  const userWithoutPassword = {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    phone: newUser.phone,
    age: newUser.age,
    emergencyContact: newUser.emergencyContact,
  };

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { user: userWithoutPassword, token },
        'Account created successfully.'
      )
    );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, 'Email and password are required.');
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const trimmedPassword = String(password).trim();

  let user = dbStore.findUserByEmail(normalizedEmail);
  if (!user) {
    if (normalizedEmail === 'admin@kineticage.com') {
      user = dbStore.createUser({
        name: 'Dr. Sarah Jenkins (Admin)',
        email: 'admin@kineticage.com',
        passwordHash: 'admin123',
        role: 'admin',
      });
    } else if (normalizedEmail === 'user@kineticage.com') {
      user = dbStore.createUser({
        name: 'Robert Vance',
        email: 'user@kineticage.com',
        passwordHash: 'user123',
        role: 'user',
      });
    } else {
      throw new ApiError(401, 'Invalid email or password.');
    }
  }

  // Match password with bcrypt or fallback for seeded users
  let isMatch = false;
  if (
    (normalizedEmail === 'admin@kineticage.com' && trimmedPassword === 'admin123') ||
    (normalizedEmail === 'user@kineticage.com' && trimmedPassword === 'user123')
  ) {
    isMatch = true;
  } else if (user.passwordHash.startsWith('$2')) {
    isMatch = await bcrypt.compare(trimmedPassword, user.passwordHash).catch(() => false);
  } else {
    isMatch = user.passwordHash === trimmedPassword;
  }

  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const token = generateToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 3600 * 1000,
  });

  const userResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    age: user.age,
    emergencyContact: user.emergencyContact,
  };

  return res.json(
    new ApiResponse(200, { user: userResponse, token }, 'Logged in successfully.')
  );
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie('token');
  return res.json(new ApiResponse(200, null, 'Logged out successfully.'));
});

export const getMe = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, 'Not authenticated.');
  }
  const user = dbStore.findUserById(req.user.id);
  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  const userResponse = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    age: user.age,
    emergencyContact: user.emergencyContact,
  };

  return res.json(new ApiResponse(200, userResponse, 'User profile retrieved.'));
});
