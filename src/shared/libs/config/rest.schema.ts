import convict from "convict";
import validator from "convict-format-with-validator";

convict.addFormats(validator);

export type RestSchema = {
  PORT: number;
  SALT: string;
  DB_HOST: string;
};

export const configRestSchema = convict<RestSchema>({
  PORT: {
    doc: "here description of this env variable",
    format: "port",
    env: "PORT",
    default: 4000,
  },
  SALT: {
    doc: "Salt for password hash",
    format: String,
    env: "SALT",
    default: null,
  },
  DB_HOST: {
    doc: "ID Address of the database server (MongoDB)",
    format: "ipaddress",
    env: "DB_HOST",
    default: "127.0.0.1",
  },
});
