import { inject, injectable } from "inversify";
import { Logger } from "../shared/libs/logger/index.js";
import { Config, RestSchema } from "../shared/libs/config/index.js";
import { Component } from "../shared/types/index.js";
import { DatabaseClient } from "../shared/libs/database-client/index.js";
import { getMongoURI } from "../shared/helpers/index.js";
import { UserModel } from "../shared/modules/user/index.js";

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient)
    private readonly databaseClient: DatabaseClient
  ) {}

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

  public async init() {
    this.logger.info("Application initiated");
    this.logger.info(`Get value from env $PORT: ${this.config.get("PORT")}`);

    this.logger.info("Initializing database...");
    await this.initDB();
    this.logger.info("Database initialized!");

    const user = new UserModel({
      email: "test@email.loca",
      avatarPath: "keks.jpg",
      firstname: "Keks",
      lastname: "Unknown",
    });

    const error = user.validateSync();
    console.log(error);
  }
}
