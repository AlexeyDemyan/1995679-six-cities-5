import { inject, injectable } from "inversify";
import express, { Express } from "express";
import { Logger } from "../shared/libs/logger/index.js";
import { Config, RestSchema } from "../shared/libs/config/index.js";
import { Component } from "../shared/types/index.js";
import { DatabaseClient } from "../shared/libs/database-client/index.js";
import { getMongoURI } from "../shared/helpers/index.js";
import { UserModel } from "../shared/modules/user/index.js";

@injectable()
export class RestApplication {
  private server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient)
    private readonly databaseClient: DatabaseClient
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

  public async init() {
    this.logger.info("Application initiated");
    this.logger.info(`Get value from env $PORT: ${this.config.get("PORT")}`);

    this.logger.info("Initializing database...");
    await this.initDB();
    this.logger.info("Database initialized!");

    this.logger.info("Attempting to initiliaze server");
    await this._initServer();
    this.logger.info(
      `Server started on http://localhost:${this.config.get("PORT")}`
    );

    const user = new UserModel({
      email: "test@email.loca",
      avatarPath: "keks.jpg",
      firstname: "Keks",
      lastname: "Unknown",
    });

    const error = user.validateSync();
    console.log(error);

    const testUser = UserModel.create({
      email: "test@emailru",
      avatarPath: "keks.jpg",
      firstname: "2",
      lastname: "Unknown",
    });

    console.log(testUser);
  }
}
