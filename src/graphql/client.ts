import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { WebSocketLink } from 'apollo-link-ws';
import { onError } from 'apollo-link-error';

const cache = new InMemoryCache()

//log errors to the console
const logErrors = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      )
    if (networkError) console.log(`[Network error]: ${networkError}`)
  })

// pass authentication header when exists
const authMiddleware = new ApolloLink((operation: any, forward: any) => {
    if (localStorage.getItem('token')) {
      operation.setContext({
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    }
    return forward(operation)
  })

const wsLink = new WebSocketLink({
    uri: 'ws://localhost:8080/v1/graphql',
    options: {
      reconnect: true
    }
  })
// TODO: initial state?
const client = new ApolloClient({
    link: ApolloLink.from([logErrors, authMiddleware, wsLink]),
    cache
});

export default client;
