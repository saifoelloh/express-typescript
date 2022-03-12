import { Router } from 'express';
import { CreateCourseDto } from '@dtos/courses.dto';
import { Routes } from '@interfaces/routes.interface';
import validationMiddleware from '@middlewares/validation.middleware';
import authMw from '@/middlewares/auth.middleware';
import { imageUploadMw } from '@/middlewares/media.middleware';
import { ImageDto } from '@/dtos/image.dto';
import ChapterController from '@/controllers/chapters.controller';
import { CreateChapterDto } from '@/dtos/chapters.dto';

class ChaptersRoute implements Routes {
  public path = '/chapters';
  public router = Router();
  public chapterController = new ChapterController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.chapterController.getChapters);
    this.router.get(`${this.path}/:id`, this.chapterController.getChapterById);
    this.router.post(
      `${this.path}`,
      authMw(),
      validationMiddleware(CreateChapterDto, 'body'),
      this.chapterController.createChapter,
    );
    this.router.patch(
      `${this.path}/:id`,
      authMw(),
      validationMiddleware(CreateChapterDto, 'body', true),
      this.chapterController.updateChapter,
    );
    this.router.delete(`${this.path}/:id`, authMw(), this.chapterController.deleteChapter);
  }
}

export default ChaptersRoute;
