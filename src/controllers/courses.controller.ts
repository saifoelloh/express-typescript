import { NextFunction, Request, Response } from 'express';
import { Course, Image } from '@prisma/client';
import { CreateCourseDto } from '@dtos/courses.dto';
import CourseService from '@services/courses.service';
import { HttpException } from '@/exceptions/HttpException';
import { Pagination } from '@/interfaces/shared.interface';
import _, { find } from 'lodash';
import ImageService from '@/services/image.service';
import { ImageDto } from '@/dtos/image.dto';
import { deleteImageMw } from '@/middlewares/media.middleware';

class CoursesController {
  private readonly courseService = new CourseService();
  private readonly imageService = new ImageService();

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

  public addPhoto = async (req, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findCourse: Course = await this.courseService.findCourseBy({ key: 'id', value: req.params.id });
      if (_.isEmpty(findCourse)) throw new HttpException(404, 'Not Found');

      const image = await this.imageService.createImage(req.fileData);
      const updatedCourse = await this.courseService.uploadImage(findCourse.id, { id: image.id });
      res.status(200).json({ data: updatedCourse, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public updatePhoto = async (req, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findCourse: Course = await this.courseService.findCourseBy({ key: 'id', value: req.params.id });
      if (_.isEmpty(findCourse)) throw new HttpException(404, 'Not Found');

      const findImage = await this.imageService.findImageBy({ key: 'id', value: req.params.imageId });
      if (_.isEmpty(findImage)) throw new HttpException(404, 'Not Found');

      const updatedCourse = await this.courseService.updateImage(findCourse.id, { ...findImage, ...req.fileData });
      await deleteImageMw(findImage.path);
      res.status(200).json({ data: updatedCourse, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deletePhoto = async (req, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findCourse: Course = await this.courseService.findCourseBy({ key: 'id', value: req.params.id });
      if (_.isEmpty(findCourse)) throw new HttpException(404, 'Not Found');

      const findImage = await this.imageService.findImageBy({ key: 'id', value: req.params.imageId });
      if (_.isEmpty(findImage)) throw new HttpException(404, 'Not Found');

      const updatedCourse = await this.courseService.deleteImage(findCourse.id, { id: findImage.id });
      await deleteImageMw(findImage.path);
      res.status(200).json({ data: updatedCourse, message: 'success' });
    } catch (error) {
      next(error);
    }
  };
}

export default CoursesController;
