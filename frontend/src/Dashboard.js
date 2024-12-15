import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import Profile from "./Profile";

const GET_POSTS = gql`
	query GetPosts {
		getPosts {
			id
			content
			createdAt
			author {
				id
				name
				email
			}
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
`;

const CREATE_POST = gql`
	mutation CreatePost($content: String!) {
		createPost(content: $content) {
			id
			content
			author {
				id
				name
				email
			}
			createdAt
		}
	}
`;

const ADD_COMMENT = gql`
	mutation AddComment($postId: ID!, $content: String!) {
		addComment(postId: $postId, content: $content) {
			id
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
`;

function Dashboard() {
	const navigate = useNavigate();
	const [newPostContent, setNewPostContent] = useState("");
	const [selectedUserId, setSelectedUserId] = useState(null);
	const [commentInput, setCommentInput] = useState("");

	// const { loading, error, data } = useQuery(GET_POSTS, {
	// 	fetchPolicy: "no-cache",
	// });
	const { loading, error, data, refetch } = useQuery(GET_POSTS);

	const [createPost] = useMutation(CREATE_POST, {
		refetchQueries: [{ query: GET_POSTS }],
	});

	const [addComment] = useMutation(ADD_COMMENT, {
		refetchQueries: [{ query: GET_POSTS }],
	});

	const handleLogout = () => {
		localStorage.removeItem("token");
		alert("Logged out successfully!");
		navigate("/login");
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await createPost({ variables: { content: newPostContent } });
			setNewPostContent("");
		} catch (err) {
			console.error("Error creating post:", err.message);
		}
	};

	const handleAddComment = async (postId) => {
		try {
			// Add the comment
			await addComment({
				variables: { postId, content: commentInput[postId] },
			});

			// Clear the input field for the specific post
			setCommentInput({ ...commentInput, [postId]: "" });

			console.log("Comment added successfully!");

			// Refetch posts to update the UI with the new comment
			await refetch();
		} catch (err) {
			console.error("Failed to add comment:", err.message);
			alert("Failed to add comment. Please try again.");
		}
	};

	if (loading) return <p>Loading posts...</p>;
	if (error) return <p>Error: {error.message}</p>;

	if (selectedUserId) {
		return (
			<Profile
				userId={selectedUserId}
				onBackToDashboard={() => setSelectedUserId(null)}
			/>
		);
	}

	return (
		<div className="container">
			<h2>Dashboard</h2>
			<p>Welcome to the dashboard!</p>

			<button onClick={handleLogout}>Logout</button>

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

			<h3>Posts</h3>
			<ul>
				{data.getPosts
					.slice() // Create a shallow copy of posts to avoid mutating the original data
					.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort posts
					.map((post) => (
						<li key={post.id}>
							<p>
								<strong
									style={{ cursor: "pointer", color: "blue" }}
									onClick={() => setSelectedUserId(post.author.id)}
								>
									{post.author.name}
								</strong>{" "}
								({post.author.email})<br />
								{post.content}
							</p>
							<p>
								<small>
									Posted on:{" "}
									{new Date(parseInt(post.createdAt)).toLocaleString()}
								</small>
							</p>

							<div className="comment-section">
								<h4>Comments:</h4>
								{post.comments.length === 0 ? (
									<p>No comments yet.</p>
								) : (
									<ul>
										{post.comments.map((comment, index) => (
											<li key={index}>
												<p className="comment-author">
													<strong>{comment.author.name}</strong> (
													{comment.author.email})<br />
													{comment.content}
												</p>
												<p>
													<small>
														Commented on:{" "}
														{new Date(
															parseInt(comment.createdAt)
														).toLocaleString()}
													</small>
												</p>
											</li>
										))}
									</ul>
								)}

								<h4>Add a Comment:</h4>
								<input
									type="text"
									placeholder="Write a comment..."
									value={commentInput[post.id] || ""}
									onChange={(e) =>
										setCommentInput({
											...commentInput,
											[post.id]: e.target.value,
										})
									}
								/>
								<button
									onClick={() => handleAddComment(post.id)}
									disabled={!commentInput[post.id]?.trim()}
								>
									Submit
								</button>
							</div>
						</li>
					))}
			</ul>
		</div>
	);
}

export default Dashboard;
