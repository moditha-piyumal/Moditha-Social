import React from "react";
import { useQuery, gql } from "@apollo/client";
import "./App.css";

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
				comments {
					content
					createdAt
					author {
						name
						email
					}
				}
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
			{/* Button to navigate back to the Dashboard */}
			<button onClick={onBackToDashboard}>Back to Dashboard</button>
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
					<li
						style={{ border: "solid maroon", marginBottom: "2em" }}
						key={post.id}
					>
						<p>
							<strong style={{ fontWeight: "bold", color: "brown" }}>
								{post.content}
							</strong>
						</p>
						<p>
							<small>
								Posted on:{" "}
								{post.createdAt
									? new Date(parseInt(post.createdAt)).toLocaleString()
									: "Invalid Date"}
							</small>
						</p>

						{/* Display Comments */}
						<div style={{ marginLeft: "20px" }}>
							<h4>Comments:</h4>
							{post.comments && post.comments.length > 0 ? ( // Safely check for comments
								<ul>
									{post.comments.map((comment, index) => (
										<li key={index}>
											<p>
												<strong>{comment.author?.name || "Anonymous"}</strong> (
												{comment.author?.email || "no-email@example.com"})
											</p>
											<p>{comment.content}</p>
											<p>
												<small>
													Commented on:{" "}
													{comment.createdAt
														? new Date(
																parseInt(comment.createdAt)
														  ).toLocaleString()
														: "Invalid Date"}
												</small>
											</p>
										</li>
									))}
								</ul>
							) : (
								<p>No comments yet.</p>
							)}
						</div>
					</li>
				))}
			</ul>
		</div>
	);
}

export default Profile;
