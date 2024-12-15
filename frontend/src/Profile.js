import React from "react";
import { useQuery, gql } from "@apollo/client";

// GraphQL query to fetch user details and posts
const GET_USER = gql`
	query GetUser($id: ID!) {
		user(id: $id) {
			id
			name
			email
			posts {
				id
				content
				createdAt
			}
		}
	}
`;

function Profile({ userId, onBackToDashboard }) {
	// Fetch user details using Apollo's useQuery
	const { loading, error, data } = useQuery(GET_USER, {
		variables: { id: userId },
	});

	if (loading) return <p>Loading user profile...</p>;
	if (error) return <p>Error: {error.message}</p>;

	const { name, email, posts } = data.user;

	return (
		<div>
			<h2>Profile</h2>
			<p>
				<strong>Name:</strong> {name}
			</p>
			<p>
				<strong>Email:</strong> {email}
			</p>

			{/* List of user posts */}
			<h3>Posts by {name}</h3>
			<ul>
				{posts.map((post) => (
					<li key={post.id}>
						<p>{post.content}</p>
						<p>
							<small>
								Posted on: {new Date(post.createdAt).toLocaleString()}
							</small>
						</p>
					</li>
				))}
			</ul>

			{/* Button to navigate back to the Dashboard */}
			<button onClick={onBackToDashboard}>Back to Dashboard</button>
		</div>
	);
}

export default Profile;
