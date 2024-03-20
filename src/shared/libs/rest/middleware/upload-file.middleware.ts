import { NextFunction, Request, Response } from "express";
import multer, { diskStorage } from "multer";
import { extension } from "mime-types";
import * as crypto from "node:crypto";
import { Middleware } from "./middleware.interface.js";

export class UploadFileMiddleware implements Middleware {
  constructor(private uploadDirectory: string, private fileName: string) {}

  public async execute(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const fileExtension = extension(file.mimetype);
        const fileName = crypto.randomUUID();
        callback(null, `${fileName}.${fileExtension}`);
      },
    });

    const uploadSingleFileMiddleware = multer({ storage }).single(
      this.fileName
    );

    uploadSingleFileMiddleware(req, res, next);
  }
}
