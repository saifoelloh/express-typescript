import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMw from '@/middlewares/auth.middleware';
import { imageUploadMw } from '@/middlewares/media.middleware';

class UsersRoute implements Routes {
  public path = '/users';
  public router = Router();
  public usersController = new UsersController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.usersController.getUsers);
    this.router.get(`${this.path}/:id`, this.usersController.getUserById);
    this.router.post(`${this.path}`, validationMiddleware(CreateUserDto, 'body'), this.usersController.createUser);
    this.router.patch(
      `${this.path}/:id`,
      authMw(),
      validationMiddleware(CreateUserDto, 'body', true),
      this.usersController.updateUserById,
    );
    this.router.patch(`${this.path}/:id/image`, authMw(), imageUploadMw('photo'), this.usersController.uploadImage);
    this.router.delete(`${this.path}/:id`, authMw(), this.usersController.deleteUserById);
  }
}

export default UsersRoute;
