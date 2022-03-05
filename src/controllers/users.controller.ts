import { NextFunction, Request, Response } from 'express';
import { User } from '@prisma/client';
import { CreateUserDto } from '@dtos/users.dto';
import userService from '@services/users.service';
import { Pagination } from '@/interfaces/shared.interface';
import * as _ from 'lodash';
import { hash } from 'bcrypt';
import { HttpException } from '@/exceptions/HttpException';
import { ImageService } from '@/services/image.service';

class UsersController {
  readonly userService = new userService();
  readonly imageService = new ImageService();

  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let pagination = {},
        filter = {};
      if (!_.isEmpty(req.query?.pagination)) {
        pagination = JSON.parse(req.query.pagination as string);
      }

      if (!_.isEmpty(req.query?.filter)) {
        filter = JSON.parse(req.query.filter as string);
      }

      const data: [User[], number] = await this.userService.findAllUser(pagination as Pagination<User>, filter);
      res.status(200).json({ data, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user: User = await this.userService.findUserBy({ key: 'id', value: req.params.id });
      if (!_.isEmpty(user)) throw new HttpException(409, 'Conflict');

      res.status(200).json({ data: user, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { password, ...body } = req.body as CreateUserDto;
      const findUser = await this.userService.findUserBy({ key: 'email', value: body.email });
      if (!_.isEmpty(findUser)) throw new HttpException(409, 'Conflict');

      const hashedPassword = await hash(password, 10);
      const data: User = await this.userService.createUser({ ...body, password: hashedPassword });
      res.status(201).json({ data, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { password, ...body } = req.body as CreateUserDto;
      const findUser = await this.userService.findUserBy({ key: 'id', value: req.params.id });
      if (_.isEmpty(findUser)) throw new HttpException(404, 'Not Found');

      const hashedPassword = await hash(password, 10);
      const data: User = await this.userService.updateUser(findUser.id, { ...findUser, ...body, password: hashedPassword });
      res.status(200).json({ data, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public uploadPhoto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req['user'] as User;
      console.log({ file: req['fileData'] });
      const image = await this.imageService.createImage(req['fileData']);
      const data = await this.userService.updateUser(user.id, { ...user, imageId: image.id });
      res.status(200).json({ data, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findUser = await this.userService.findUserBy({ key: 'id', value: req.params.id });
      if (_.isEmpty(findUser)) throw new HttpException(404, 'Not Found');

      await this.userService.deleteUser(findUser.id);
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  };
}

export default UsersController;
