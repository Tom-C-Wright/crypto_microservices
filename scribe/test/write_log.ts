import * as chai from "chai";
import chaiHttp from "chai-http";
import { describe } from "mocha";
import { config } from "./config";

chai.use(chaiHttp);

export default describe("POST /log", () => {
  it("200 on valid request", async () => {
    const body = {};

    const response = await fetch(`${config.baseURL}/log`, {
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
