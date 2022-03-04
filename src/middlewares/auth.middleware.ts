import * as _ from 'lodash';
import { NextFunction, Response } from 'express';
import { UserRole } from '@prisma/client';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import dotenv from 'dotenv';
import AuthService from '@/services/auth.service';
import UserService from '@/services/users.service';
dotenv.config();

const authService = new AuthService();
const userService = new UserService();

const authMiddleware =
  (roles: UserRole[] = [UserRole.ADMIN, UserRole.COORDINATOR, UserRole.USER]) =>
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const token = req.cookies['Authorization'];
    if (_.isEmpty(token)) next(new HttpException(401, 'Unauthorized'));

    try {
      const payload: DataStoredInToken = authService.verifyToken(token);

      const user = await userService.findUserBy({ key: 'id', value: payload.id });
      if (_.isEmpty(user)) next(new HttpException(401, 'Unauthorized'));

      if (!roles.includes(user.role)) next(new HttpException(403, 'Forbidden'));

      req.user = user;
      next();
    } catch (error) {
      console.log(error);
      next(new HttpException(401, 'Unauthorized'));
    }
  };

export default authMiddleware;
