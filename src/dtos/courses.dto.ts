import { IsArray, IsNumber, IsString, IsUUID } from 'class-validator';

type CategoryIdDto = {
  id: string;
};

export class CreateCourseDto {
  @IsString()
  public name: string;

  @IsString()
  public description: string;

  @IsNumber()
  public price: number;

  @IsUUID('4')
  public coordinatorId: string;

  @IsArray()
  public categories?: CategoryIdDto[];
}
