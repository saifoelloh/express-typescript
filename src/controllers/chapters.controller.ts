import * as _ from 'lodash';
import { NextFunction, Request, Response } from 'express';
import { Chapter } from '@prisma/client';

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

      const chapters: [Chapter[], number] = await this.chapterService.findAllChapter(
        pagination as Pagination<Chapter>,
        filter,
      );
      res.status(200).json({ data: chapters, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getChapterById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const course: Chapter = await this.chapterService.findChapterBy({
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
      const findCourse: Chapter = await this.chapterService.findChapterBy({
        key: 'title',
        value: body.title,
      });
      if (!_.isEmpty(findCourse)) throw new HttpException(409, 'Conflict');

      const course: Chapter = await this.chapterService.createChapter(body);
      res.status(201).json({ data: course, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateChapter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const body = req.body as CreateChapterDto;
    try {
      const findCourse: Chapter = await this.chapterService.findChapterBy({
        key: 'id',
        value: req.params.id,
      });
      if (_.isEmpty(findCourse)) throw new HttpException(404, 'Not Found');

      const course: Chapter = await this.chapterService.updateChapter(findCourse.id, body);
      res.status(200).json({ data: course, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteChapter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findCourse: Chapter = await this.chapterService.findChapterBy({
        key: 'id',
        value: req.params.id,
      });
      if (_.isEmpty(findCourse)) throw new HttpException(404, 'Not Found');

      await this.chapterService.deleteChapter(findCourse.id);
      res.status(200).end();
    } catch (error) {
      next(error);
    }
  };
}

export default ChapterController;
