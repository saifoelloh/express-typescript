import { IsArray, IsNumber, IsString, IsUUID, ValidateNested } from 'class-validator';

class CategoryIdDto {
  @IsUUID('4')
  public id: string;
}

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
