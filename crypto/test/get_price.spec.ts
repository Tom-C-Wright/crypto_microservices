import * as chai from "chai";
import { assert, expect } from "chai";
import chaiHttp from "chai-http";
import { describe } from "mocha";
import { config } from "./config";

chai.use(chaiHttp);

export default describe("POST /search/email_price", () => {
  it("200 on valid request", async () => {
    const body = {
      coin: "bitcoin",
      email: "tom.wright.dev@gmail.com",
    };

    const response = await fetch(`${config.baseURL}/search/email_price`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "x-api-key": config.apiKey,
      },
    });

    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  });
});
