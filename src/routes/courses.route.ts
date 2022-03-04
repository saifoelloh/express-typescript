import { Router } from 'express';
import CoursesController from '@controllers/courses.controller';
import { CreateCourseDto } from '@dtos/courses.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMiddleware from '@/middlewares/auth.middleware';

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
    this.router.post(`${this.path}`, authMiddleware(), validationMiddleware(CreateCourseDto, 'body'), this.usersController.createCourse);
    this.router.put(`${this.path}/:id`, authMiddleware(), validationMiddleware(CreateCourseDto, 'body', true), this.usersController.updateCourse);
    this.router.delete(`${this.path}/:id`, authMiddleware(), this.usersController.deleteCourse);
  }
}

export default CoursesRoute;
