import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";

// GraphQL mutation to add a user
const ADD_USER = gql`
	mutation AddUser($name: String!, $email: String!) {
		addUser(name: $name, email: $email) {
			id
			name
			email
		}
	}
`;

// GraphQL query to fetch all users (same as in UserList.js)
const GET_USERS = gql`
	query {
		users {
			id
			name
			email
		}
	}
`;

function AddUser() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");

	// Use Apollo Client's useMutation hook with refetch option
	const [addUser, { data, loading, error }] = useMutation(ADD_USER, {
		refetchQueries: [{ query: GET_USERS }], // Refetch the users query after mutation
	});

	const handleSubmit = (e) => {
		e.preventDefault(); // Prevent default form submission behavior
		addUser({ variables: { name, email } }); // Call the mutation
		setName(""); // Clear the input fields
		setEmail("");
	};

	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	return (
		<div>
			<h1>Add a New User</h1>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Name"
					value={name}
					onChange={(e) => setName(e.target.value)} // Update state for name
				/>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)} // Update state for email
				/>
				<button type="submit">Add User</button>
			</form>
			{data && (
				<p>
					Added: {data.addUser.name} ({data.addUser.email})
				</p>
			)}
		</div>
	);
}

export default AddUser;
