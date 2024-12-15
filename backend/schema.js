const { gql } = require("apollo-server");

const typeDefs = gql`
	type User {
		id: ID!
		name: String!
		email: String!
	}

	type Comment {
		content: String!
		author: User!
		createdAt: String!
	}

	type Post {
		id: ID!
		content: String!
		author: User!
		createdAt: String!
		comments: [Comment!]! # Include comments
	}

	type AuthPayload {
		token: String!
		user: User!
	}

	type Query {
		users(name: String): [User!]!
		getPosts: [Post!]!
		user(id: ID!): UserWithPosts!
	}

	type UserWithPosts {
		id: ID!
		name: String!
		email: String!
		posts: [Post!]!
	}

	type Mutation {
		signupUser(name: String!, email: String!, password: String!): AuthPayload!
		loginUser(email: String!, password: String!): AuthPayload!
		updateUser(id: ID!, name: String, email: String): User!
		createPost(content: String!): Post! # New mutation for creating posts
		addComment(postId: ID!, content: String!): Post!
	}
`;

module.exports = typeDefs;
