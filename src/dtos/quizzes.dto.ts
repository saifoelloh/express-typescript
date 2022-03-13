import { QuizType } from '@prisma/client';
import { IsEnum, IsString, IsUUID } from 'class-validator';

export class CreateQuizDto {
  @IsString()
  question: string;

  @IsEnum(QuizType)
  quizType: QuizType;

  @IsUUID('4')
  chapterId: string;
}
