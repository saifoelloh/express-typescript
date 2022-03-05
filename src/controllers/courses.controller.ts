import { NextFunction, Request, Response } from 'express';
import { Course } from '@prisma/client';
import { CreateCourseDto } from '@dtos/courses.dto';
import CourseService from '@services/courses.service';
import UserService from '@/services/users.service';
import { HttpException } from '@/exceptions/HttpException';
import { Pagination } from '@/interfaces/shared.interface';
import _ from 'lodash';

class CoursesController {
  public courseService = new CourseService();
  public userService = new UserService();

  public getCourses = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let pagination = {};
      if (req.query?.pagination) {
        pagination = JSON.parse(req.query.pagination as string);
      }

      let filter = {};
      if (req.query?.filter) {
        filter = JSON.parse(req.query.filter as string);
      }

      const data: [Course[], number] = await this.courseService.findAllCourses(
        pagination as Pagination<Course>,
        filter,
      );
      res.status(200).json({ data, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getCourseById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const course: Course = await this.courseService.findCourseBy({ key: 'id', value: req.params.id });
      if (_.isEmpty(course)) throw new HttpException(404, 'Not Found');

      res.status(200).json({ data: course, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body = req.body as CreateCourseDto;
    try {
      const findCourse: Course = await this.courseService.findCourseBy({ key: 'name', value: body.name });
      if (!_.isEmpty(findCourse)) throw new HttpException(409, 'Conflict');

      const course: Course = await this.courseService.createCourse(body);
      res.status(201).json({ data: course, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body = req.body as CreateCourseDto;
    try {
      const findCourse: Course = await this.courseService.findCourseBy({ key: 'id', value: req.params.id });
      if (_.isEmpty(findCourse)) throw new HttpException(404, 'Not Found');

      const course: Course = await this.courseService.updateCourse(findCourse.id, body);
      res.status(200).json({ data: course, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteCourse = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findCourse: Course = await this.courseService.findCourseBy({ key: 'id', value: req.params.id });
      if (_.isEmpty(findCourse)) throw new HttpException(404, 'Not Found');

      await this.courseService.deleteCourse(findCourse.id);
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  };
}

export default CoursesController;
