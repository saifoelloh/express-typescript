import * as _ from 'lodash';
import { Prisma, PrismaClient, Chapter } from '@prisma/client';
import { HttpException } from '@exceptions/HttpException';
import { FindOneOption, Pagination } from '@/interfaces/shared.interface';
import { CreateChapterDto } from '@/dtos/chapters.dto';

class ChapterService {
  readonly prisma = new PrismaClient();
  readonly courseChapter = this.prisma.chapter;

  public async findAllChapter(
    pagination: Pagination<Chapter>,
    filter: Prisma.CategoryWhereInput = {},
  ): Promise<[Chapter[], number]> {
    const { show = 10, page = 0, orderBy = [{ createdAt: 'desc' }] } = pagination;
    const payload: [Chapter[], number] = await this.prisma.$transaction([
      this.courseChapter.findMany({
        skip: show * page,
        take: show,
        orderBy,
        where: filter,
        include: { course: true, _count: true },
      }),
      this.courseChapter.count({ where: filter }),
    ]);
    return payload;
  }

  public async findChapterBy(option: FindOneOption<Chapter>): Promise<Chapter> {
    if (_.isEmpty(option)) throw new HttpException(400, 'Bad Request');

    const { key, value } = option;
    const course = await this.courseChapter.findFirst({
      where: { [key]: value },
      include: { course: true, quizzes: true },
    });
    return course;
  }

  public async createChapter(courseChapterData: CreateChapterDto): Promise<Chapter> {
    if (_.isEmpty(courseChapterData)) throw new HttpException(400, "You're not course");

    const course = await this.courseChapter.create({
      data: courseChapterData,
      include: { course: true, quizzes: true },
    });
    return course;
  }

  public async updateChapter(courseChapterId: string, courseChapterData: CreateChapterDto): Promise<Chapter> {
    if (_.isEmpty(courseChapterData)) throw new HttpException(400, "You're not courseData");

    const updateCourseData = await this.courseChapter.update({
      where: { id: courseChapterId },
      data: courseChapterData,
    });
    return updateCourseData;
  }

  public async deleteChapter(courseId: string): Promise<Chapter> {
    if (_.isEmpty(courseId)) throw new HttpException(400, 'Bad Request');

    const deleteCourseData = await this.courseChapter.delete({ where: { id: courseId } });
    return deleteCourseData;
  }
}

export default ChapterService;
