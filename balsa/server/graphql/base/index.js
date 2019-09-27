import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    _: String!
  }

  type Mutation {
    _: String!
  }
`;

module.exports = {
  typeDefs,
};
