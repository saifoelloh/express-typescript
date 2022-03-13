import * as _ from 'lodash';
import { PrismaClient, Quiz } from '@prisma/client';
import { HttpException } from '@exceptions/HttpException';
import { FindOneOption } from '@/interfaces/shared.interface';
import { CreateQuizDto } from '@/dtos/quizzes.dto';

class QuizService {
  readonly prisma = new PrismaClient();
  readonly quiz = this.prisma.quiz;

  public async findQuizBy(option: FindOneOption<Quiz>): Promise<Quiz> {
    if (_.isEmpty(option)) throw new HttpException(400, 'Bad Request');

    const { key, value } = option;
    const course = await this.quiz.findFirst({ where: { [key]: value } });
    return course;
  }

  public async createQuiz(quizDto: CreateQuizDto): Promise<Quiz> {
    if (_.isEmpty(quizDto)) throw new HttpException(400, "You're not course");

    const course = await this.quiz.create({ data: quizDto });
    return course;
  }

  public async updateQuizById(quizId: string, quizDto: CreateQuizDto): Promise<Quiz> {
    if (_.isEmpty(quizDto)) throw new HttpException(400, "You're not courseData");

    const updatedQuiz = await this.quiz.update({
      where: { id: quizId },
      data: quizDto,
    });
    return updatedQuiz;
  }

  public async deleteQuizById(quizId: string): Promise<Quiz> {
    if (_.isEmpty(quizId)) throw new HttpException(400, 'Bad Request');

    const deletedQuiz = await this.quiz.delete({ where: { id: quizId } });
    return deletedQuiz;
  }
}

export default QuizService;
