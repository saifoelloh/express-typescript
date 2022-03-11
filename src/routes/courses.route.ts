import { Router } from 'express';
import CoursesController from '@controllers/courses.controller';
import { CreateCourseDto } from '@dtos/courses.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMw from '@/middlewares/auth.middleware';
import { imageUploadMw } from '@/middlewares/media.middleware';
import { ImageDto } from '@/dtos/image.dto';

class CoursesRoute implements Routes {
  public path = '/courses';
  public router = Router();
  public usersController = new CoursesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.usersController.getCourses);
    this.router.get(`${this.path}/:id`, this.usersController.getCourseById);
    this.router.post(
      `${this.path}`,
      authMw(),
      validationMiddleware(CreateCourseDto, 'body'),
      this.usersController.createCourse,
    );
    this.router.patch(
      `${this.path}/:id`,
      authMw(),
      validationMiddleware(CreateCourseDto, 'body', true),
      this.usersController.updateCourse,
    );
    this.router.delete(`${this.path}/:id`, authMw(), this.usersController.deleteCourse);

    // Course's Media
    this.router.post(`${this.path}/:id/image`, authMw(), imageUploadMw('photo'), this.usersController.addPhoto);
    this.router.patch(
      `${this.path}/:id/image/:imageId`,
      authMw(),
      imageUploadMw('photo'),
      this.usersController.updatePhoto,
    );
    this.router.delete(`${this.path}/:id/image/:imageId`, authMw(), this.usersController.deletePhoto);
  }
}

export default CoursesRoute;
