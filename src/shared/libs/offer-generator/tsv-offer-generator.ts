import dayjs from "dayjs";
import { OfferGenerator } from "./offer-generator.interface.js";
import { MockServerData } from "../../types/index.js";
import {
  generateRandomValue,
  getRandomItems,
  getRandomItem,
} from "../../helpers/index.js";

const MIN_PRICE = 100;
const MAX_PRICE = 100000;

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const city = getRandomItem<string>(this.mockData.cities);
    const images = getRandomItems<string>(this.mockData.images).join(";");
    const photos = getRandomItems<string>(this.mockData.photos).join(";");
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();
    const type = getRandomItem<string>(this.mockData.offerTypes);
    const facilities = getRandomItems<string>(this.mockData.facilities).join(
      ";"
    );
    const user = getRandomItem<string>(this.mockData.users);

    const createDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), "day")
      .toISOString();

    return [
      title,
      description,
      city,
      images,
      photos,
      price,
      type,
      facilities,
      user,
      createDate,
    ].join("\t");
  }
}
