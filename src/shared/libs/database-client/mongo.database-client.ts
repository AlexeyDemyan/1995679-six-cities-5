import * as Mongoose from "mongoose";
import { inject, injectable } from "inversify";
import { DatabaseClient } from "./database-client.interface.js";
import { Component } from "../../types/index.js";
import { Logger } from "../logger/index.js";

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private mongoose: typeof Mongoose;
  private isConnected: boolean;

  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    this.isConnected = false;
  }

  public isConnectedToDatabase() {
    return this.isConnected;
  }

  public async connect(uri: string): Promise<void> {
    if (this.isConnectedToDatabase()) {
      throw new Error("MongoDB client already connected");
    }

    this.logger.info("Attempting to connect to MongoDB...");

    this.mongoose = await Mongoose.connect(uri);
    this.isConnected = true;

    this.logger.info("Established connection to database");
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnectedToDatabase()) {
      throw new Error("Not connected to database");
    }

    await this.mongoose.disconnect?.();
    this.isConnected = false;
    this.logger.info("Disconnected from database");
  }
}
