const { gql } = require("apollo-server");

const typeDefs = gql`
	type User {
		id: ID!
		name: String!
		email: String!
	}

	type AuthPayload {
		token: String!
		user: User!
	}

	type Query {
		users(name: String): [User!]!
		user(id: ID!): User!
	}

	type Mutation {
		signupUser(name: String!, email: String!, password: String!): AuthPayload!
		loginUser(email: String!, password: String!): AuthPayload!
		updateUser(id: ID!, name: String, email: String): User! # This line defines the updateUser mutation
	}
`;

module.exports = typeDefs;
