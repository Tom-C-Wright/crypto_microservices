interface TestConfig {
  baseURL: string;
  apiKey: string;
}

declare global {
  namespace NodeJS {
    export interface ProcessEnv {
      AWS_APIGW_STAGE: string;
      AWS_APIGW_ID: string;
      APIGATEWAY_API_KEY: string;
    }
  }
}

export const config: TestConfig = ((): TestConfig => {
  if (!process.env.APIGATEWAY_API_KEY) {
    throw new Error("Missing APIGATEWAY_API_KEY from .env");
  }

  if (!process.env.AWS_APIGW_ID) {
    throw new Error("Missing AWS_APIGW_ID from .env");
  }

  if (!process.env.AWS_APIGW_STAGE) {
    throw new Error("Missing AWS_APIGW_STAGE from .env");
  }

  return {
    baseURL: `https://${process.env.AWS_APIGW_ID}.execute-api.ap-southeast-2.amazonaws.com/${process.env.AWS_APIGW_STAGE}`,
    apiKey: process.env.APIGATEWAY_API_KEY,
  };
})();
