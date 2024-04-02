import { inject, injectable } from "inversify";
import express, { Express } from "express";
import { Logger } from "../shared/libs/logger/index.js";
import { Config, RestSchema } from "../shared/libs/config/index.js";
import { Component } from "../shared/types/index.js";
import { DatabaseClient } from "../shared/libs/database-client/index.js";
import { getMongoURI } from "../shared/helpers/index.js";
// import { UserModel } from "../shared/modules/user/index.js";
import {
  Controller,
  ExceptionFilter,
  ParseTokenMiddleware,
} from "../shared/libs/rest/index.js";

@injectable()
export class RestApplication {
  private server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient)
    private readonly databaseClient: DatabaseClient,
    @inject(Component.CategoryController)
    private readonly categoryController: Controller,
    @inject(Component.ExceptionFilter)
    private readonly appExceptionFilter: ExceptionFilter,
    @inject(Component.UserController)
    private readonly userController: Controller,
    @inject(Component.OfferController)
    private readonly offerController: Controller,
    @inject(Component.CommentController)
    private readonly commentController: Controller,
    @inject(Component.AuthExceptionFilter)
    private readonly authExceptionFilter: ExceptionFilter,
    @inject(Component.HttpExceptionFilter)
    private readonly httpExceptionFilter: ExceptionFilter,
    @inject(Component.ValidationExceptionFilter)
    private readonly validationExceptionFilter: ExceptionFilter
  ) {
    this.server = express();
  }

  private async initDB() {
    const mongoUri = getMongoURI(
      this.config.get("DB_USER"),
      this.config.get("DB_PASSWORD"),
      this.config.get("DB_HOST"),
      this.config.get("DB_PORT"),
      this.config.get("DB_NAME")
    );

    console.log(mongoUri);
    return this.databaseClient.connect("mongodb://127.0.0.1:27017/");
  }

  public async _initServer() {
    const port = this.config.get("PORT");
    this.server.listen(port);
  }

  private async _initControllers() {
    this.server.use("/categories", this.categoryController.router);
    this.server.use("/users", this.userController.router);
    this.server.use("/offers", this.offerController.router);
    this.server.use("/comments", this.commentController.router);
  }

  private async _initMiddleware() {
    const authenticateMiddleware = new ParseTokenMiddleware(
      this.config.get("JWT_SECRET")
    );

    this.server.use(express.json());
    this.server.use(
      "/uploads",
      express.static(this.config.get("UPLOAD_DIRECTORY"))
    );
    this.server.use(
      authenticateMiddleware.execute.bind(authenticateMiddleware)
    );
  }

  private async _initExceptionFilters() {
    this.server.use(
      this.authExceptionFilter.catch.bind(this.authExceptionFilter)
    );
    this.server.use(
      this.validationExceptionFilter.catch.bind(this.validationExceptionFilter)
    );
    this.server.use(
      this.httpExceptionFilter.catch.bind(this.httpExceptionFilter)
    );
    this.server.use(
      this.appExceptionFilter.catch.bind(this.appExceptionFilter)
    );
  }

  public async init() {
    this.logger.info("Application initiated");
    this.logger.info(`Get value from env $PORT: ${this.config.get("PORT")}`);

    this.logger.info("Initializing database...");
    await this.initDB();
    this.logger.info("Database initialized!");

    this.logger.info("Initializing app-level middleware...");
    await this._initMiddleware();
    this.logger.info("App-level middleware initialized!");

    this.logger.info("Init controllers");
    await this._initControllers();
    this.logger.info("Controllers initialized!");

    this.logger.info("Initializing exception filters...");
    await this._initExceptionFilters();
    this.logger.info("Exception filters initialized...");

    this.logger.info("Attempting to initiliaze server");
    await this._initServer();
    this.logger.info(
      `Server started on http://localhost:${this.config.get("PORT")}`
    );

    // const user = new UserModel({
    //   email: "test@email.loca",
    //   avatarPath: "keks.jpg",
    //   firstname: "Keks",
    //   lastname: "Unknown",
    // });

    // const error = user.validateSync();
    // console.log(error);

    // const testUser = UserModel.create({
    //   email: "test@emailru",
    //   avatarPath: "keks.jpg",
    //   firstname: "2",
    //   lastname: "Unknown",
    // });

    // console.log(testUser);
  }
}
