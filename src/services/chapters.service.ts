import { Prisma, PrismaClient, CourseChapter, Image } from '@prisma/client';
import { CreateCourseDto } from '@dtos/courses.dto';
import { HttpException } from '@exceptions/HttpException';
import { FindOneOption, Pagination } from '@/interfaces/shared.interface';
import * as _ from 'lodash';
import { ImageDto, ImageIdDto } from '@/dtos/image.dto';
import { CreateChapterDto } from '@/dtos/chapters.dto';

class ChapterService {
  public courseChapter = new PrismaClient().courseChapter;

  public async findAllCourseChapters(
    pagination: Pagination<CourseChapter>,
    filter: Prisma.CategoryWhereInput = {},
  ): Promise<CourseChapter[]> {
    const { show = 10, page = 0, orderBy = [{ createdAt: 'desc' }] } = pagination;
    const courses: CourseChapter[] = await this.courseChapter.findMany({
      skip: show * page,
      take: show,
      orderBy,
      where: filter,
      include: { course: true, _count: true },
    });
    return courses;
  }

  public async findCourseChapterBy(option: FindOneOption<CourseChapter>): Promise<CourseChapter> {
    if (_.isEmpty(option)) throw new HttpException(400, 'Bad Request');

    const { key, value } = option;
    const course = await this.courseChapter.findFirst({
      where: { [key]: value },
      include: { course: true, quizzes: true },
    });
    return course;
  }

  public async createCourseChapter(courseChapterData: CreateChapterDto): Promise<CourseChapter> {
    if (_.isEmpty(courseChapterData)) throw new HttpException(400, "You're not course");

    const course = await this.courseChapter.create({
      data: courseChapterData,
      include: { course: true, quizzes: true },
    });
    return course;
  }

  public async updateCourse(courseChapterId: string, courseChapterData: CreateChapterDto): Promise<CourseChapter> {
    if (_.isEmpty(courseChapterData)) throw new HttpException(400, "You're not courseData");

    const updateCourseData = await this.courseChapter.update({
      where: { id: courseChapterId },
      data: courseChapterData,
    });
    return updateCourseData;
  }

  public async deleteCourse(courseId: string): Promise<CourseChapter> {
    if (_.isEmpty(courseId)) throw new HttpException(400, 'Bad Request');

    const deleteCourseData = await this.courseChapter.delete({ where: { id: courseId } });
    return deleteCourseData;
  }
}

export default ChapterService;
