import { NextFunction, Response } from 'express';
import jwt, { verify, VerifyOptions } from 'jsonwebtoken';
import { PrismaClient, UserRole } from '@prisma/client';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const authMiddleware =
  (roles: UserRole[] = [UserRole.ADMIN]) =>
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

      if (Authorization) {
        const key: jwt.Secret = fs.readFileSync(__dirname + '/../../public.key');
        const verifyOptions: VerifyOptions = { algorithms: ['ES512'] };

        const verificationResponse = verify(Authorization, key, verifyOptions) as DataStoredInToken;
        const userId = verificationResponse.id;

        const users = new PrismaClient().user;
        const findUser = await users.findUnique({ where: { id: userId } });

        if (!findUser) {
          next(new HttpException(401, 'Wrong authentication token'));
        }

        if (!roles.includes(findUser.role)) {
          next(new HttpException(403, "You're not allowed"));
        }

        req.user = findUser;
        next();
      } else {
        next(new HttpException(404, 'Authentication token missing'));
      }
    } catch (error) {
      console.log(error);
      next(new HttpException(401, 'Wrong authentication token'));
    }
  };

export default authMiddleware;
