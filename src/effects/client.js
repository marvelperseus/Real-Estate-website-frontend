import { GraphQLClient } from 'graphql-request';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

export const graphQlClient = new GraphQLClient(publicRuntimeConfig.ENDPOINT, {
  credentials: publicRuntimeConfig.CREDENTIALS,
});
