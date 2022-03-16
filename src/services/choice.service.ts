import * as _ from 'lodash';
import { Prisma, PrismaClient, Choice } from '@prisma/client';
import { HttpException } from '@exceptions/HttpException';
import { FindOneOption, Pagination } from '@/interfaces/shared.interface';
import { CreateChoiceDto } from '@/dtos/choice.dto';

class ChoiceService {
  readonly prisma = new PrismaClient();
  readonly choice = this.prisma.quizAnswer;

  public async findAllChoice(
    pagination: Pagination<Choice>,
    filter: Prisma.CategoryWhereInput = {},
  ): Promise<[Choice[], number]> {
    const { show = 10, page = 0, orderBy = [{ createdAt: 'desc' }] } = pagination;
    const payload: [Choice[], number] = await this.prisma.$transaction([
      this.choice.findMany({
        skip: show * page,
        take: show,
        orderBy,
        where: filter,
      }),
      this.choice.count({ where: filter }),
    ]);
    return payload;
  }

  public async findChoiceBy(option: FindOneOption<Choice>): Promise<Choice> {
    if (_.isEmpty(option)) throw new HttpException(400, 'Bad Request');

    const { key, value } = option;
    const choice = await this.choice.findFirst({
      where: { [key]: value },
    });
    return choice;
  }

  public async createChoice(data: CreateChoiceDto): Promise<Choice> {
    if (_.isEmpty(data)) throw new HttpException(400, "You're not course");

    const course = await this.choice.create({ data });
    return course;
  }

  public async updateChoice(choiceId: string, data: CreateChoiceDto): Promise<Choice> {
    if (_.isEmpty(data)) throw new HttpException(400, "You're not courseData");

    const updatedChoice = await this.choice.update({
      where: { id: choiceId },
      data: data,
    });
    return updatedChoice;
  }

  public async deleteChoice(choiceId: string): Promise<Choice> {
    if (_.isEmpty(choiceId)) throw new HttpException(400, 'Bad Request');

    const deletedChoice = await this.choice.delete({ where: { id: choiceId } });
    return deletedChoice;
  }
}

export default ChoiceService;
