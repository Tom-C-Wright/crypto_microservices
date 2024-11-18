import { AppStatus, Client, ClientResponse } from "../../common/client";
import { Config } from "../../services/config";
import { Logger } from "../../services/logger";
import { BasicLogger } from "../../services/logger/cloudwatch";
import { WriteEventLogRequestBody } from "./models";

/**
 * Client responsible for handling the logic for the Email Price handler.
 */
export class WriteEventLogClient implements Client<WriteEventLogRequestBody, void> {
  // Services
  protected logger: Logger;

  constructor(params: { logger: Logger }) {
    this.logger = params.logger;
  }

  async handle(request: WriteEventLogRequestBody): Promise<ClientResponse<void>> {
    try {
      return {
        status: AppStatus.SUCCESS,
      };
    } catch (error) {
      this.logger.error({
        message: "Error occurred writing log to database.",
        data: (error as Error).message,
      });

      return {
        status: AppStatus.ERROR,
      };
    }
  }
}

/**
 * Helper function for initializing Write Log client.
 */
export function buildWriteEventLogClient(): WriteEventLogClient {
  // TODO build a centralised service to instantiate different services based on config values.
  const config = new Config();

  const basicLogger = new BasicLogger({
    debugLoggingEnabled: config.getDebugLoggingEnabled(),
  });

  return new WriteEventLogClient({
    logger: basicLogger,
  });
}
