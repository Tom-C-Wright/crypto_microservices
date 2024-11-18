/**
 * Request body for requests to write_log handler.
 */
// TODO generate JSON schema from these interfaces.
export interface WriteEventLogRequestBody {
    email: string;
    coin: string;
}