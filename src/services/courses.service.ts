import { Prisma, PrismaClient, Course } from '@prisma/client';
import { CreateCourseDto } from '@dtos/courses.dto';
import { HttpException } from '@exceptions/HttpException';
import { isEmpty } from '@utils/util';
import { Pagination } from '@/interfaces/query.interface';

class CourseService {
  public courses = new PrismaClient().course;

  public async findAllCourses(pagination: Pagination<Course>, filter: Prisma.CategoryWhereInput = {}): Promise<Course[]> {
    const { show = 10, page = 0, orderBy = [{ createdAt: 'desc' }] } = pagination;
    const allCourse: Course[] = await this.courses.findMany({
      skip: show * page,
      take: show,
      orderBy: orderBy,
      where: filter,
      include: { coordinator: true, categories: true },
    });
    return allCourse;
  }

  public async findCourseById(courseId: string): Promise<Course> {
    if (isEmpty(courseId)) throw new HttpException(400, "You're not courseId");

    const findCourse: Course = await this.courses.findFirst({ where: { id: courseId } });
    if (!findCourse) throw new HttpException(404, 'Not Found');

    return findCourse;
  }

  public async createCourse(courseData: CreateCourseDto): Promise<Course> {
    if (isEmpty(courseData)) throw new HttpException(400, "You're not course");

    const findCourse: Course = await this.courses.findUnique({ where: { name: courseData.name } });
    if (findCourse) throw new HttpException(409, `Course ${courseData.name} already exists`);

    const { categories = [], ...data } = courseData;
    const createCourseData: Course = await this.courses.create({ data: { ...data, categories: { connect: categories } } });
    return createCourseData;
  }

  public async updateCourse(courseId: string, courseData: CreateCourseDto): Promise<Course> {
    if (isEmpty(courseData)) throw new HttpException(400, "You're not courseData");

    const findCourse: Course = await this.courses.findUnique({ where: { id: courseId } });
    if (!findCourse) throw new HttpException(404, 'Not Found');

    const { categories = [], ...data } = courseData;
    const updateCourseData = await this.courses.update({ where: { id: courseId }, data: { ...data, categories: { connect: categories } } });
    return updateCourseData;
  }

  public async deleteCourse(courseId: string): Promise<Course> {
    if (isEmpty(courseId)) throw new HttpException(400, "You're not courseId");

    const findCourse: Course = await this.courses.findUnique({ where: { id: courseId } });
    if (!findCourse) throw new HttpException(404, 'Not Found');

    const deleteCourseData = await this.courses.delete({ where: { id: courseId } });
    return deleteCourseData;
  }
}

export default CourseService;
