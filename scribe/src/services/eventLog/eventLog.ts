import { QueryConfig } from "pg";
import { PostgresDatabaseService } from "../database/postgres";
import { Logger } from "../logger";

export type EventType = "SEARCH" | "ERROR";

export interface EventLog {
  id: string;
  date: string;
  service: string;
  action: string;
  data: string;
}

/**
 * Service responsible for handling the persistence and retrieval of event log data.
 */
export class EventLogService {
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

  public async logEvent(params: {
    service: string;
    action: EventType;
    data: string;
    date: Date;
  }): Promise<void> {
    try {
      const createLogStatement: QueryConfig = {
        name: "create_event_log",
        text: "INSERT INTO events (service, action, data, date) VALUES ($1, $2, $3, $4)",
        values: [
          params.service,
          params.action,
          params.data,
          this.formatDate(params.date),
        ],
      };

      await this.databaseService.query(createLogStatement);
    } catch (error) {
      this.logger.error({
        message: "Failed to insert event in database",
        data: `${(error as Error).message}\n${JSON.stringify(params)}`,
      });
    }
  }
}
