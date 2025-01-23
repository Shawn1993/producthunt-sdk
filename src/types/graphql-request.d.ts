declare module 'graphql-request' {
  export interface GraphQLClientOptions {
    headers?: Record<string, string>;
    timeout?: number;
  }

  export class GraphQLClient {
    constructor(url: string, options?: GraphQLClientOptions);
    request<T = unknown>(
      document: string,
      variables?: Record<string, unknown>
    ): Promise<T>;
  }
} 