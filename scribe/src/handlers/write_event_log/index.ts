import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { buildWriteEventClient, WriteEventRequestBody } from "./client";
import util from "util";

const client = buildWriteEventClient();

export const handler: APIGatewayProxyHandler = async (
  event,
  _context
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      throw new Error("Missing request body.");
    }

    const requestBody = JSON.parse(event.body) as WriteEventRequestBody;

    await client.handle(requestBody);

    return {
      statusCode: 200,
      body: "",
    };
  } catch (error) {
    console.log(event);
    console.log(util.format(error));

    return {
      statusCode: 500,
      body: "",
    };
  }
};
