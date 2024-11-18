import { QueryConfig } from "pg";
import { PostgresDatabaseService } from "../database/postgres";
import { Logger } from "../logger";

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

  protected async logEvent(event: EventLog): Promise<void> {
    try {
      const createLogStatement: QueryConfig = {
        name: "create_event_log",
        text: "INSERT INTO events (service, action, data, date) VALUES ($1, $2, $3, $4)",
        values: [event.service, event.action, event.data, event.date],
      };

      await this.databaseService.query(createLogStatement);
    } catch (error) {
      this.logger.error({
        message: "Failed to insert event in database",
        data: `${(error as Error).message}\n${JSON.stringify(event)}`,
      });
    }
  }
}
