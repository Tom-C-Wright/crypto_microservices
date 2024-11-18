import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { EmailPriceRequestBody } from "./models";
import { buildEmailPriceClient, EmailPriceClient } from "./client";

const client = buildEmailPriceClient();

export const handler: APIGatewayProxyHandler = async (
  event,
  _context
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      throw new Error("Missing request body.");
    }

    const requestBody = JSON.parse(event.body) as EmailPriceRequestBody;

    if (!requestBody.coin) {
      throw new Error("Invalid request body. Missing 'coin'");
    }

    if (!requestBody.email) {
      throw new Error("Invalid request body. Missing 'email'");
    }

    await client.handle(requestBody);

    return {
      statusCode: 200,
      body: "",
    };
  } catch (error) {
    console.error((error as Error).message);

    return {
      statusCode: 500,
      body: "",
    };
  }
};
