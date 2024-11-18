import { Client as PostgresClient, QueryConfig } from "pg";

/**
 * Service for handling connection and queries to Postgres database.
 */
export class PostgresDatabaseService {
  protected postgresClient: PostgresClient;

  constructor(params: {
    userName: string;
    password: string;
    host: string;
    port: number;
    database: string;
  }) {
    this.postgresClient = new PostgresClient({
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
  public async query(preparedStatement: QueryConfig): Promise<void> {
    // Establish connection to the server.
    this.postgresClient.connect();

    await this.postgresClient.query(preparedStatement);

    // Disconnect from server.
    this.postgresClient.end();
  }
}
