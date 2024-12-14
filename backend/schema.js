const { gql } = require("apollo-server");

const typeDefs = gql`
	type User {
		id: ID!
		name: String!
		email: String!
	}

	type Post {
		id: ID!
		content: String!
		author: User!
		createdAt: String!
	}

	type AuthPayload {
		token: String!
		user: User!
	}

	type Query {
		users(name: String): [User!]!
		user(id: ID!): User!
		getPosts: [Post!]!
	}

	type Mutation {
		signupUser(name: String!, email: String!, password: String!): AuthPayload!
		loginUser(email: String!, password: String!): AuthPayload!
		updateUser(id: ID!, name: String, email: String): User!
		createPost(content: String!): Post! # New mutation for creating posts
	}
`;

module.exports = typeDefs;
