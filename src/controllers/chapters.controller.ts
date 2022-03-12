import * as _ from 'lodash';
import { NextFunction, Request, Response } from 'express';
import { CourseChapter } from '@prisma/client';

import { CreateCourseDto } from '@dtos/courses.dto';
import { HttpException } from '@/exceptions/HttpException';
import { Pagination } from '@/interfaces/shared.interface';
import ChapterService from '@/services/chapters.service';
import { CreateChapterDto } from '@/dtos/chapters.dto';

class ChapterController {
  private readonly chapterService = new ChapterService();

  public getChapters = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      let pagination = {};
      if (req.query?.pagination) {
        pagination = JSON.parse(req.query.pagination as string);
      }

      let filter = {};
      if (req.query?.filter) {
        filter = JSON.parse(req.query.filter as string);
      }

      const courseChapters: CourseChapter[] = await this.chapterService.findAllCourseChapters(
        pagination as Pagination<CourseChapter>,
        filter,
      );
      res.status(200).json({ data: courseChapters, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getChapterById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const course: CourseChapter = await this.chapterService.findCourseChapterBy({
        key: 'id',
        value: req.params.id,
      });
      if (_.isEmpty(course)) throw new HttpException(404, 'Not Found');

      res.status(200).json({ data: course, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createChapter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body = req.body as CreateChapterDto;
    try {
      const findCourse: CourseChapter = await this.chapterService.findCourseChapterBy({
        key: 'title',
        value: body.title,
      });
      if (!_.isEmpty(findCourse)) throw new HttpException(409, 'Conflict');

      const course: CourseChapter = await this.chapterService.createCourseChapter(body);
      res.status(201).json({ data: course, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateChapter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body = req.body as CreateChapterDto;
    try {
      const findCourse: CourseChapter = await this.chapterService.findCourseChapterBy({
        key: 'id',
        value: req.params.id,
      });
      if (_.isEmpty(findCourse)) throw new HttpException(404, 'Not Found');

      const course: CourseChapter = await this.chapterService.updateCourse(findCourse.id, body);
      res.status(200).json({ data: course, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteChapter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findCourse: CourseChapter = await this.chapterService.findCourseChapterBy({
        key: 'id',
        value: req.params.id,
      });
      if (_.isEmpty(findCourse)) throw new HttpException(404, 'Not Found');

      await this.chapterService.deleteCourse(findCourse.id);
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  };
}

export default ChapterController;
