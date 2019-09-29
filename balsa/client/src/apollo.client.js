import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import DebounceLink from 'apollo-link-debounce';
import { createUploadLink } from 'apollo-upload-client';

const DEFAULT_DEBOUNCE_TIMEOUT = 400;

const debounceLink = new DebounceLink(DEFAULT_DEBOUNCE_TIMEOUT);

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {
      authorization: localStorage.getItem('TOKEN') ? `Bearer ${localStorage.getItem('TOKEN')}` : null,
    },
  });
  return forward(operation);
});

const cache = new InMemoryCache();

const hostname = window.location.hostname;
const protocol = window.location.protocol;
const port = process.env.VUE_APP_SERVER_PORT;
const serverUrl = `${protocol}//${hostname}${port === '80' || port === 80 ? '' : ':' + port}`;

const apolloClient = new ApolloClient({
  link: ApolloLink.from([
    authMiddleware,
    debounceLink,
    createUploadLink({
      uri: `${serverUrl}/graphql`,
    }),
  ]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
});

export default apolloClient;
