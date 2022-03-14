import * as _ from 'lodash';
import { Prisma, PrismaClient, Chapter } from '@prisma/client';
import { HttpException } from '@exceptions/HttpException';
import { FindOneOption, Pagination } from '@/interfaces/shared.interface';
import { CreateChapterDto } from '@/dtos/chapters.dto';

class ChapterService {
  readonly prisma = new PrismaClient();
  readonly chapter = this.prisma.chapter;

  public async findAllChapter(
    pagination: Pagination<Chapter>,
    filter: Prisma.CategoryWhereInput = {},
  ): Promise<[Chapter[], number]> {
    const { show = 10, page = 0, orderBy = [{ createdAt: 'desc' }] } = pagination;
    const payload: [Chapter[], number] = await this.prisma.$transaction([
      this.chapter.findMany({
        skip: show * page,
        take: show,
        orderBy,
        where: filter,
        include: { course: true, _count: true },
      }),
      this.chapter.count({ where: filter }),
    ]);
    return payload;
  }

  public async findChapterBy(option: FindOneOption<Chapter>): Promise<Chapter> {
    if (_.isEmpty(option)) throw new HttpException(400, 'Bad Request');

    const { key, value } = option;
    const course = await this.chapter.findFirst({
      where: { [key]: value },
      include: { course: true, quizzes: true },
    });
    return course;
  }

  public async createChapter(chapterDaat: CreateChapterDto): Promise<Chapter> {
    if (_.isEmpty(chapterDaat)) throw new HttpException(400, "You're not course");

    const course = await this.chapter.create({
      data: chapterDaat,
      include: { course: true, quizzes: true },
    });
    return course;
  }

  public async updateChapter(chapterId: string, chapterData: CreateChapterDto): Promise<Chapter> {
    if (_.isEmpty(chapterData)) throw new HttpException(400, "You're not courseData");

    const updateCourseData = await this.chapter.update({
      where: { id: chapterId },
      data: chapterData,
    });
    return updateCourseData;
  }

  public async deleteChapter(chapterId: string): Promise<Chapter> {
    if (_.isEmpty(chapterId)) throw new HttpException(400, 'Bad Request');

    const deleteCourseData = await this.chapter.delete({ where: { id: chapterId } });
    return deleteCourseData;
  }
}

export default ChapterService;
