import { FileReader } from "./file-reader.interface.js";
import { readFileSync } from "node:fs";
import { Offer, OfferType, OfferCity } from "../../types/index.js";

export class TSVFileReader implements FileReader {
  private rawData = "";

  constructor(private readonly filename: string) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: "utf-8" });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error(`File was not read`);
    }

    return this.rawData
      .split("\n")
      .filter((row) => row.trim().length > 0)
      .map((line) => line.split("\t"))
      .map(
        ([
          title,
          description,
          postDate,
          city,
          imagePreview,
          accommodationPhotos,
          isPremium,
          isFavorite,
          rating,
          type,
          rooms,
          guests,
          price,
          facilities,
          author,
          comments,
          coordinates,
        ]) => ({
          title,
          description,
          postDate: new Date(postDate),
          city: OfferCity[
            city as
              | "Paris"
              | "Cologne"
              | "Brussels"
              | "Amsterdam"
              | "Hamburg"
              | "Dusseldorf"
          ],
          imagePreview,
          accommodationPhotos: accommodationPhotos
            .split(";")
            .map((photo) => photo),
          isPremium,
          isFavorite,
          rating: Number.parseInt(rating, 10),
          type: OfferType[type as "Apartment" | "House" | "Room" | "Hotel"],
          rooms: Number.parseInt(rooms, 10),
          guests: Number.parseInt(guests, 10),
          price: Number.parseInt(price, 10),
          facilities: facilities.split(";").map((facility) => facility),
          author,
          comments: Number.parseInt(comments, 10),
          coordinates: {
            latitude: coordinates.split(';')[0],
            longitude: coordinates.split(';')[1],
          },
        })
      );
  }
}
