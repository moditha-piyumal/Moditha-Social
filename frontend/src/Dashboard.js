import React from "react";
import { useQuery, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";

// Define the GraphQL query to fetch posts
const GET_POSTS = gql`
	query GetPosts {
		getPosts {
			id
			content
			author {
				name
				email
			}
			createdAt
		}
	}
`;

function Dashboard() {
	const navigate = useNavigate();

	// Fetch posts using Apollo Client's useQuery hook
	const { loading, error, data } = useQuery(GET_POSTS);

	// Handle user logout
	const handleLogout = () => {
		localStorage.removeItem("token"); // Remove the JWT token
		alert("Logged out successfully!"); // Notify the user
		navigate("/login"); // Redirect to the login page
	};

	if (loading) return <p>Loading posts...</p>;
	if (error) return <p>Error: {error.message}</p>;

	return (
		<div>
			<h2>Dashboard</h2>
			<p>Welcome to the dashboard!</p>

			{/* Logout button */}
			<button onClick={handleLogout}>Logout</button>

			{/* Display posts */}
			<h3>Posts</h3>
			<ul>
				{data.getPosts.map((post) => (
					<li key={post.id}>
						<p>
							<strong>{post.author.name}</strong> ({post.author.email})<br />
							{post.content}
						</p>
						<p>
							<small>
								Posted on:{" "}
								{post.createdAt
									? new Date(post.createdAt).toLocaleString()
									: "Unknown Date"}
							</small>
						</p>
					</li>
				))}
			</ul>
		</div>
	);
}

export default Dashboard;
