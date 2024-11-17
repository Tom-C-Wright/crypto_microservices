import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";

interface EmailPriceRequestBody {
    email: string;
    coin: string;
}

export const EmailPriceHandler: APIGatewayProxyHandler = async (
  event,
  context
): Promise<APIGatewayProxyResult> => {
  try {
    if (!event.body) {
      throw new Error("Missing request body.");
    }

    const requestBody = JSON.parse(event.body) as EmailPriceRequestBody;

    console.log(requestBody);

    return {
      statusCode: 200,
      body: "yay",
    };
  } catch (error) {
    
    throw error;
  }
};
