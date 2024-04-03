import { Expose } from "class-transformer";

export class uploadImageRdo {
  @Expose()
  public image: string;
}
