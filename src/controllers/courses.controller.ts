import { NextFunction, Request, Response } from 'express';
import { Course } from '@prisma/client';
import { CreateCourseDto } from '@dtos/courses.dto';
import CourseService from '@services/courses.service';
import UserService from '@/services/users.service';
import { HttpException } from '@/exceptions/HttpException';

class CoursesController {
  public courseService = new CourseService();
  public userService = new UserService();

  public getCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let pagination = {},
        filter = {};
      if (req.query?.pagination) {
        pagination = JSON.parse(req.query.pagination);
      }

      if (req.query?.filter) {
        filter = JSON.parse(req.query.filter);
      }

      const findAllCoursesData: Course[] = await this.courseService.findAllCourses(pagination, filter);

      res.status(200).json({ data: findAllCoursesData, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getCourseById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findOneCourseData: Course = await this.courseService.findCourseById(req.params.id);

      res.status(200).json({ data: findOneCourseData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courseData: CreateCourseDto = req.body;
      const coordinator = await this.userService.findUserById(courseData.coordinatorId);
      if (coordinator.role === 'ADMIN' || coordinator.role === 'USER') throw new HttpException(403, 'ENTOD');

      const createCourseData: Course = await this.courseService.createCourse(courseData);
      res.status(201).json({ data: createCourseData, message: 'created' });
    } catch (error) {
      console.log({ error });
      next(error);
    }
  };

  public updateCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const courseData: CreateCourseDto = req.body;
      const coordinator = await this.userService.findUserById(courseData.coordinatorId);
      if (coordinator.role === 'ADMIN' || coordinator.role === 'USER') throw new HttpException(403, 'ENTOD');

      const updateCourseData: Course = await this.courseService.updateCourse(req.params.id, courseData);
      res.status(200).json({ data: updateCourseData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const deleteCourseData: Course = await this.courseService.deleteCourse(req.params.id);

      res.status(200).json({ data: deleteCourseData, message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default CoursesController;
