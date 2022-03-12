import * as _ from 'lodash';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { Pagination, FindOneOption } from '@/interfaces/shared.interface';

class UserService {
  readonly prisma = new PrismaClient();
  readonly users = this.prisma.user;

  public async findAllUser(
    pagination: Pagination<User>,
    filter: Prisma.CategoryWhereInput = {},
  ): Promise<[User[], number]> {
    const { show = 10, page = 0, orderBy = [{ createdAt: 'desc' }] } = pagination;
    const payload: [User[], number] = await this.prisma.$transaction([
      this.users.findMany({
        skip: show * page,
        take: show,
        orderBy,
        where: filter,
      }),
      this.users.count({ where: filter }),
    ]);
    return payload;
  }

  public async findUserBy(option: FindOneOption<User>): Promise<User> {
    if (_.isEmpty(option)) throw new HttpException(400, 'Bad Request');

    const { key, value } = option;
    const findUser: User = await this.users.findUnique({
      where: { [key]: value },
      include: { courses: true, image: true },
    });
    return findUser;
  }

  public async createUser(data: CreateUserDto): Promise<User> {
    if (_.isEmpty(data)) throw new HttpException(400, 'Bad Request');

    const createUserData = await this.users.create({ data });
    return createUserData;
  }

  public async updateUser(userId: string, userData: User): Promise<User> {
    if (_.isEmpty(userData)) throw new HttpException(400, 'Bad Request');

    const updateUserData = await this.users.update({
      where: { id: userId },
      data: { ...userData },
      include: { image: true, courses: true },
    });
    return updateUserData;
  }

  public async deleteUser(userId: string): Promise<User> {
    if (_.isEmpty(userId)) throw new HttpException(400, 'Bad Request');

    const deleteUserData = await this.users.delete({ where: { id: userId } });
    return deleteUserData;
  }
}

export default UserService;
