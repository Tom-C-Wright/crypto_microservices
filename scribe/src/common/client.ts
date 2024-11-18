import { APIGatewayProxyResult } from "aws-lambda";

export enum AppStatus {
  ERROR,
  SUCCESS,
  NOT_FOUND,
  CONFLICT,
}

export interface ClientResponse<T> {
  status: AppStatus;
  body?: T;
}

/**
 * Definition for all clients used by handlers across microservice.
 */
export interface Client<A, B> {
  handle(request: A): Promise<ClientResponse<B>>;
}
