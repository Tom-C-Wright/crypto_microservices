import { AppStatus, Client, ClientResponse } from "../../common/client";
import { Config } from "../../services/config";
import { PostgresDatabaseService } from "../../services/database/postgres";
import {
  EventService,
  EventType,
  isOfEventType,
} from "../../services/events/events";
import { Logger } from "../../services/logger";
import { BasicLogger } from "../../services/logger/cloudwatch";

/**
 * Request body for requests to write_log handler.
 */
// TODO generate JSON schema from these interfaces.
export interface WriteEventRequestBody {
  service: string;
  action: EventType;
  data: any;
}

/**
 * Client responsible for handling the logic for the Email Price handler.
 */
export class WriteEventClient implements Client<WriteEventRequestBody, void> {
  // Services
  protected logger: Logger;
  protected eventService: EventService;

  constructor(params: { logger: Logger; eventService: EventService }) {
    this.logger = params.logger;
    this.eventService = params.eventService;
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

      const event = {
        ...request,
        date: dateNow,
      };

      this.logger.debug({
        message: "Writing event to database",
        data: JSON.stringify(event),
      });

      await this.eventService.writeEvent(event);
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
export function buildWriteEventClient(): WriteEventClient {
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
    database: config.getEventDatabaseName(),
    logger: basicLogger,
  });

  const eventService = new EventService({
    logger: basicLogger,
    databaseService: postgresDatabaseService,
  });

  return new WriteEventClient({
    logger: basicLogger,
    eventService,
  });
}
