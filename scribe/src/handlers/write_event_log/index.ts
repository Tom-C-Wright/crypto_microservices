import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { WriteEventLogRequestBody } from "./models";
import { buildWriteEventLogClient, WriteEventLogClient } from "./client";

const client = buildWriteEventLogClient();

export const handler: APIGatewayProxyHandler = async (
  event,
  _context
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      throw new Error("Missing request body.");
    }

    const requestBody = JSON.parse(event.body) as WriteEventLogRequestBody;

    await client.handle(requestBody);

    return {
      statusCode: 200,
      body: "",
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: "",
    };
  }
};
