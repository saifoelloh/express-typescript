import { IsBoolean, IsString, IsUUID } from 'class-validator';

export class CreateChoiceDto {
  @IsUUID('4')
  quizId: string;

  @IsString()
  answer: string;

  @IsBoolean()
  isCorrect: boolean;
}
