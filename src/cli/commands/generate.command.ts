import got from "got";
import { appendFile } from "node:fs/promises";
import { Command } from "./command.interface.js";
import { MockServerData } from "../../shared/types/index.js";
import { TSVOfferGenerator } from "../../shared/libs/offer-generator/tsv-offer-generator.js";

export class GenerateCommand implements Command {
  private initialData: MockServerData;

  private async write(filepath: string, offerCount: number) {
    const tsvOfferGenerator = new TSVOfferGenerator(this.initialData);

    for (let i = 0; i < offerCount; i++) {
      await appendFile(filepath, `${tsvOfferGenerator.generate()}\n`, {
        encoding: "utf-8",
      });
    }
  }

  private async load(url: string) {
    try {
      this.initialData = await got.get(url).json();
    } catch {
      throw new Error(`Cannot load data from ${url}`);
    }
  }

  public getName(): string {
    return "--generate";
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    try {
      await this.load(url);
      await this.write(filepath, offerCount);
      console.info(`File ${filepath} created`);
    } catch (error: unknown) {
      console.error(`Failed to generate data`);

      if (error instanceof Error) {
        console.error(error.message);
      }
    }
  }
}
