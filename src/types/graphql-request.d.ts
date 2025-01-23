declare module 'graphql-request' {
  export class GraphQLClient {
    constructor(url: string, options?: any);
    request<T = any>(
      document: string,
      variables?: { [key: string]: any }
    ): Promise<T>;
  }
} 