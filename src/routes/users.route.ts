import { Router } from 'express';
import UsersController from '@controllers/users.controller';
import { CreateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMw from '@/middlewares/auth.middleware';
import { imageUploadMw } from '@/middlewares/media.middleware';
import OrderController from '@/controllers/orders.controller';

class UsersRoute implements Routes {
  readonly path = '/users';
  readonly router = Router();
  readonly usersController = new UsersController();
  readonly orderController = new OrderController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.usersController.getUsers);
    this.router.get(`${this.path}/me`, authMw(), this.usersController.returnCurrentUser);
    this.router.get(`${this.path}/:id`, this.usersController.getUserById);
    this.router.post(`${this.path}`, validationMiddleware(CreateUserDto, 'body'), this.usersController.createUser);
    this.router.patch(
      `${this.path}/:id`,
      authMw(),
      imageUploadMw('photo'),
      validationMiddleware(CreateUserDto, 'body', true),
      this.usersController.updateUserById,
    );
    this.router.delete(`${this.path}/:id`, authMw(), this.usersController.deleteUserById);

    // ORDER ROUTE
    this.router.get(`${this.path}/:userId/orders`, authMw(), this.orderController.getOrders);
    this.router.get(`${this.path}/:userId/orders/:orderId`, authMw(), this.orderController.getOrderById);
  }
}

export default UsersRoute;
