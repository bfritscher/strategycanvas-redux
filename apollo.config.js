module.exports = {
  client: {
    service: {
      name: 'hasura',
      // optional headers
      /*
        headers: {
            authorization: 'Bearer '
        },
        */
      url: 'http://localhost:8080/v1/graphql'
    }
  }
};
