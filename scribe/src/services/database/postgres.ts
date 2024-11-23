// Cannot import individual postgres modules due to:
// https://github.com/brianc/node-postgres/issues/2819
import pg from "pg";
import { Logger } from "../logger";
import util from "util";

/**
 * Service for handling connection and queries to Postgres database.
 */
export class PostgresDatabaseService {
  protected postgresClient: pg.Client;
  protected logger: Logger;

  constructor(params: {
    userName: string;
    password: string;
    host: string;
    port: number;
    database: string;
    logger: Logger;
  }) {
    this.logger = params.logger;

    this.postgresClient = new pg.Client({
      user: params.userName,
      password: params.password,
      host: params.host,
      port: params.port,
      database: params.database,
    });
  }

  /**
   * Wrapper around database client to enforce the use of prepared statements to access the database.
   */
  public async query(preparedStatement: pg.QueryConfig): Promise<void> {
    try {
      await this.postgresClient.connect();

      const result = await this.postgresClient.query(preparedStatement);

      this.logger.debug({
        message: "postgres query result",
        data: JSON.stringify(result),
      });

      await this.postgresClient.end();
    } catch (error) {
      this.logger.error({
        message: "Failed to write data to RDS",
        data: util.format(error),
      });
    }
  }
}
