import { Prisma, PrismaClient, Course, Image } from '@prisma/client';
import { CreateCourseDto } from '@dtos/courses.dto';
import { HttpException } from '@exceptions/HttpException';
import { FindOneOption, Pagination } from '@/interfaces/shared.interface';
import * as _ from 'lodash';
import { ImageDto, ImageIdDto } from '@/dtos/image.dto';

class CourseService {
  readonly prisma = new PrismaClient();
  readonly courses = this.prisma.course;

  public async findAllCourses(
    pagination: Pagination<Course>,
    filter: Prisma.CategoryWhereInput = {},
  ): Promise<[Course[], number]> {
    const { show = 10, page = 0, orderBy = [{ createdAt: 'desc' }] } = pagination;
    const payload: [Course[], number] = await this.prisma.$transaction([
      this.courses.findMany({
        skip: show * page,
        take: show,
        orderBy,
        where: filter,
        include: { coordinator: true, categories: true, chapters: true },
      }),
      this.courses.count({ where: filter }),
    ]);

    return payload;
  }

  public async findCourseBy(option: FindOneOption<Course>): Promise<Course> {
    if (_.isEmpty(option)) throw new HttpException(400, 'Bad Request');

    const { key, value } = option;
    const course = await this.courses.findFirst({
      where: { [key]: value },
      include: { categories: true, coordinator: true, images: true, chapters: true },
    });
    return course;
  }

  public async createCourse(courseData: CreateCourseDto): Promise<Course> {
    if (_.isEmpty(courseData)) throw new HttpException(400, "You're not course");

    const { categories = [], ...data } = courseData;
    const course = await this.courses.create({
      data: { ...data, categories: { connect: categories } },
      include: { coordinator: true, categories: true },
    });
    return course;
  }

  public async updateCourse(courseId: string, courseData: CreateCourseDto): Promise<Course> {
    if (_.isEmpty(courseData)) throw new HttpException(400, "You're not courseData");

    const { categories = [], ...data } = courseData;
    const updateCourseData = await this.courses.update({
      where: { id: courseId },
      data: { ...data, categories: { connect: categories } },
    });
    return updateCourseData;
  }

  public async deleteCourse(courseId: string): Promise<Course> {
    if (_.isEmpty(courseId)) throw new HttpException(400, 'Bad Request');

    const deleteCourseData = await this.courses.delete({ where: { id: courseId } });
    return deleteCourseData;
  }

  public async uploadImage(courseId: string, image: ImageIdDto): Promise<Course> {
    if (_.isEmpty(image)) throw new HttpException(400, "You're not courseData");
    const updatedCourse = await this.courses.update({
      where: { id: courseId },
      data: {
        images: { connect: image },
      },
    });

    return updatedCourse;
  }

  public async updateImage(courseId: string, image: Image): Promise<Course> {
    if (_.isEmpty(image)) throw new HttpException(400, "You're not courseData");
    const updatedCourse = await this.courses.update({
      where: { id: courseId },
      data: {
        images: {
          update: {
            where: { id: image.id },
            data: image,
          },
        },
      },
    });

    return updatedCourse;
  }

  public async deleteImage(courseId: string, image: ImageIdDto): Promise<Course> {
    if (_.isEmpty(image)) throw new HttpException(400, "You're not courseData");
    const updatedCourse = await this.courses.update({
      where: { id: courseId },
      data: {
        images: { delete: image },
      },
    });

    return updatedCourse;
  }
}

export default CourseService;
