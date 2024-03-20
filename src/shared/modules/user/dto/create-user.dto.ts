import { IsEmail, IsString, Length } from 'class-validator';
import { CreateUserMessage } from './create-user.message.js';

export class CreateUserDto {
  @IsEmail({}, { message: CreateUserMessage.email.invalidFormat })
  public email: string;

  @IsString({ message: CreateUserMessage.avatarPath.invalidFormat })
  public avatarPath: string;

  @IsString({ message: CreateUserMessage.firstname.invalidFormat })
  @Length(1, 15, { message: CreateUserMessage.firstname.lengthField })
  public firstname: string;

  @IsString({ message: CreateUserMessage.lastname.invalidFormat })
  @Length(1, 15, { message: CreateUserMessage.lastname.lengthField })
  public lastname: string;

  @IsString({ message: CreateUserMessage.password.invalidFormat })
  @Length(6, 12, { message: CreateUserMessage.password.lengthField })
  public password: string;
}
