import { Request } from 'express';
import { User, UserRole } from '@prisma/client';

export interface DataStoredInToken {
  id: string;
  role: UserRole;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}
