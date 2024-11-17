import * as chai from "chai";
import { assert, expect } from "chai";
import chaiHttp from "chai-http";
import { describe } from "mocha";
import { config } from "./config";

chai.use(chaiHttp);

export default describe("POST /search/email_price", async() => {
  it("200 on valid request", async () => {

    const body = {
        test: "",
    }
    
    const response = await fetch(`${config.baseURL}/search/email_price`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "x-api-key": config.apiKey,
        }
    });

    assert(response.status === 200);
  });
  
});
