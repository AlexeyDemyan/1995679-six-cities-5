import { IsMongoId, IsString, Length } from "class-validator";
import { CreateCommentMessage } from "./create-comment.message.js";

export class CreateCommentDto {
  @IsString({ message: CreateCommentMessage.text.invalidFormat })
  @Length(5, 1024, { message: "min is 5, max is 1024 " })
  public text: string;

  @IsMongoId({ message: CreateCommentMessage.offerId.invalidFormat })
  public offerId: string;

  public userId: string;
}
