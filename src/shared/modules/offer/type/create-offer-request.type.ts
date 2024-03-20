import { Request } from "express";
import { RequestBody, RequestParams } from "../../../libs/rest/index.js";
import { CreateOffetDto } from "../dto/create-offer.dto.js";

export type CreateOfferRequest = Request<
  RequestParams,
  RequestBody,
  CreateOffetDto
>;
