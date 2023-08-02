import supertest from "supertest";
import { logger } from "../src/app/logging.js";
import { web } from "../src/app/web.js";

beforeAll(async () => {
  logger.silent = true;
});

afterAll(async () => {
  logger.silent = false;
});

export const request = supertest(web);
