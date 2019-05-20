import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import fetch from 'isomorphic-unfetch';
import getConfig from 'next/config';
const { publicRuntimeConfig } = getConfig();

let apolloClient = null;

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser || !global.fetch) {
  global.fetch = fetch;
}

function create(initialState) {
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: new HttpLink({
      uri: publicRuntimeConfig.WEBSITE_URL, // 'http://localhost/api/graphql', // Server URL (must be absolute)
      credentials: publicRuntimeConfig.CREDENTIALS, // Additional fetch() options like `credentials` or `headers`
      headers: { Accept: 'application/json' },
    }),
    cache: new InMemoryCache({
      addTypename: false,
    }).restore(initialState || {}),
  });
}

export default function initApollo(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
}
