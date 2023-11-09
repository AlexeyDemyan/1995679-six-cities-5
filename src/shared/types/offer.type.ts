import { OfferCity } from "./offer-city.enum.js";
import { OfferType } from "./offer-type.enum.js";
// import { OfferFacilities } from "./offer-facilities.enum.js";
import { Coordinates } from "./coordinates.type.js";

export type Offer = {
  title: string;
  description: string;
  postDate: Date;
  city: OfferCity;
  imagePreview: string;
  accommodationPhotos: string[];
  isPremium: string;
  isFavorite: string;
  rating: number;
  type: OfferType;
  rooms: number;
  guests: number;
  price: number;
  facilities: string[];
  author: string;
  comments: number;
  coordinates: Coordinates;
}
