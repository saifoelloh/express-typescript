import { NextFunction, Request, Response } from 'express';
import { LoginUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import AuthService from '@services/auth.service';
import UserService from '@/services/users.service';
import { compare } from 'bcrypt';
import { HttpException } from '@/exceptions/HttpException';
import _ from 'lodash';

class AuthController {
  private authService = new AuthService();
  private userService = new UserService();

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json({ data: user, message: 'Success create new user' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body as LoginUserDto;
      const user = await this.userService.findUserBy({ key: 'email', value: email });

      const isPasswordMatching: boolean = await compare(password, user.password);
      if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

      const token = await this.authService.createToken(user);
      const maxAge = Math.pow(60, 2) * 1000;
      res.cookie('Authorization', token, { httpOnly: true, maxAge });
      res.status(200).json({ data: user, message: 'login' });
    } catch (error) {
      next(error);
    }
  };

  public logOut = (req: RequestWithUser, res: Response): void => {
    res.clearCookie('Authorization');
    res.status(200).end();
  };
}

export default AuthController;
