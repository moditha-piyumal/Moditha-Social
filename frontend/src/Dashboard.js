import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";

// GraphQL queries and mutations
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

const CREATE_POST = gql`
	mutation CreatePost($content: String!) {
		createPost(content: $content) {
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
	const [newPostContent, setNewPostContent] = useState("");

	// Fetch posts
	const { loading, error, data } = useQuery(GET_POSTS);

	// Mutation to create a post
	const [createPost] = useMutation(CREATE_POST, {
		refetchQueries: [{ query: GET_POSTS }], // Refresh the posts after creating a new one
	});

	// Handle user logout
	const handleLogout = () => {
		localStorage.removeItem("token");
		alert("Logged out successfully!");
		navigate("/login");
	};

	// Handle post submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await createPost({ variables: { content: newPostContent } });
			setNewPostContent(""); // Clear the input field
		} catch (err) {
			console.error("Error creating post:", err.message);
		}
	};

	if (loading) return <p>Loading posts...</p>;
	if (error) return <p>Error: {error.message}</p>;

	return (
		<div>
			<h2>Dashboard</h2>
			<p>Welcome to the dashboard!</p>

			{/* Logout button */}
			<button onClick={handleLogout}>Logout</button>

			{/* Post creation form */}
			<h3>Create a New Post</h3>
			<form onSubmit={handleSubmit}>
				<textarea
					value={newPostContent}
					onChange={(e) => setNewPostContent(e.target.value)}
					placeholder="What's on your mind?"
					rows="4"
					cols="50"
					required
				></textarea>
				<br />
				<button type="submit">Post</button>
			</form>

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
								Posted on: {new Date(post.createdAt).toLocaleString()}
							</small>
						</p>
					</li>
				))}
			</ul>
		</div>
	);
}

export default Dashboard;
