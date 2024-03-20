import { IsString, Length } from 'class-validator';
import { CreateCategoryMessage } from './create-category.message.js';

export class CreateCategoryDto {
  @IsString({ message: CreateCategoryMessage.name.invalidFormat })
  @Length(4, 12, { message: CreateCategoryMessage.name.lengthField })
  public name: string;
}
