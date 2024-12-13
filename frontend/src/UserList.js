import React from "react";
import { useQuery, gql } from "@apollo/client";

// 1. Define the GraphQL query
const GET_USERS = gql`
	query {
		users {
			id
			name
			email
		}
	}
`;

function UserList() {
	// 2. Use the query with Apollo Client's useQuery hook
	const { loading, error, data } = useQuery(GET_USERS);
	console.log({ loading, error, data }); // Log the fetch state

	// 3. Handle loading and error states
	if (loading) return <p>Loading...</p>;
	if (error) return <p>Error: {error.message}</p>;

	// 4. Display the list of users
	return (
		<div>
			<h1>User List</h1>
			<ul>
				{data.users.map((user) => (
					<li key={user.id}>
						<strong>{user.name}</strong> - {user.email}
					</li>
				))}
			</ul>
		</div>
	);
}

export default UserList;
