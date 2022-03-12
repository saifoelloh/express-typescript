import { IsString, IsUUID } from 'class-validator';

export class CreateChapterDto {
  @IsUUID('4')
  courseId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;
}

export interface ChapterIdDto {
  id: string;
}
