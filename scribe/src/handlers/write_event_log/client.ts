import { AppStatus, Client, ClientResponse } from "../../common/client";
import { Config } from "../../services/config";
import { PostgresDatabaseService } from "../../services/database/postgres";
import { EventLogService, EventType } from "../../services/eventLog/eventLog";
import { Logger } from "../../services/logger";
import { BasicLogger } from "../../services/logger/cloudwatch";

/**
 * Request body for requests to write_log handler.
 */
// TODO generate JSON schema from these interfaces.
export interface WriteEventLogRequestBody {
  service: string;
  action: EventType;
  data: string;
}

/**
 * Client responsible for handling the logic for the Email Price handler.
 */
export class WriteEventLogClient
  implements Client<WriteEventLogRequestBody, void>
{
  // Services
  protected logger: Logger;
  protected eventLogService: EventLogService;

  constructor(params: { logger: Logger; eventLogService: EventLogService }) {
    this.logger = params.logger;
    this.eventLogService = params.eventLogService;
  }

  async handle(
    request: WriteEventLogRequestBody
  ): Promise<ClientResponse<void>> {
    try {
      // Validate request
      if (request.action !== "SEARCH" && request.action !== "ERROR") {
        return {
          status: AppStatus.ERROR,
        };
      }

      // Log event for current date and time.
      const dateNow = new Date();

      await this.eventLogService.logEvent({
        ...request,
        date: dateNow,
      });
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

  const postgresDatabaseService = new PostgresDatabaseService({
    userName: config.getRdsUsername(),
    password: config.getRdsPassword(),
    host: config.getRdsHostname(),
    port: config.getRdsPort(),
    database: config.getEventLogDatabaseName(),
  });

  const eventLogService = new EventLogService({
    logger: basicLogger,
    databaseService: postgresDatabaseService,
  });

  return new WriteEventLogClient({
    logger: basicLogger,
    eventLogService,
  });
}
