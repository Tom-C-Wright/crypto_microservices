import { QueryConfig } from "pg";
import { PostgresDatabaseService } from "../database/postgres";
import { Logger } from "../logger";

export type EventType = "SEARCH" | "ERROR";

export function isOfEventType(input: string): input is EventType {
  return ["SEARCH", "ERROR"].includes(input);
}

export interface Event {
  id: string;
  date: string;
  service: string;
  action: string;
  data: string;
}

/**
 * Service responsible for handling the persistence and retrieval of event log data.
 */
export class EventService {
  protected logger: Logger;
  protected databaseService: PostgresDatabaseService;

  constructor(params: {
    logger: Logger;
    databaseService: PostgresDatabaseService;
  }) {
    this.logger = params.logger;
    this.databaseService = params.databaseService;
  }

  /**
   * Generate a date string from the provided date object.
   */
  protected formatDate(date: Date): string {
    return date.toISOString();
  }

  public async writeEvent(params: {
    service: string;
    action: EventType;
    data: string;
    date: Date;
  }): Promise<void> {
    try {
      const createLogStatement: QueryConfig = {
        name: "create_event_log",
        text: "INSERT INTO events (service_name, action, data, created_at) VALUES ($1, $2, $3, $4)",
        values: [
          params.service,
          params.action,
          params.data,
          this.formatDate(params.date),
        ],
      };

      this.logger.info({
        message: "Structured query",
        data: JSON.stringify(createLogStatement),
      });

      await this.databaseService.query(createLogStatement);
    } catch (error) {
      this.logger.error({
        message: "Failed to insert event in database",
        data: `${(error as Error).message}\n${JSON.stringify(params)}`,
      });
    }
  }
}
