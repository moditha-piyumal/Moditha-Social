import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";

// GraphQL mutation for signup
const SIGNUP_USER = gql`
	mutation SignupUser($name: String!, $email: String!, $password: String!) {
		signupUser(name: $name, email: $email, password: $password) {
			token
			user {
				id
				name
				email
			}
		}
	}
`;

function SignupForm() {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [signupUser, { data, loading, error }] = useMutation(SIGNUP_USER);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await signupUser({ variables: formData });
			console.log("Signup successful:", response.data.signupUser);
			alert("Signup successful! You can now log in.");
		} catch (err) {
			console.error("Signup error:", err.message);
		}
	};

	return (
		<div>
			<h2>Signup</h2>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					name="name"
					placeholder="Name"
					value={formData.name}
					onChange={handleChange}
					required
				/>
				<input
					type="email"
					name="email"
					placeholder="Email"
					value={formData.email}
					onChange={handleChange}
					required
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
					value={formData.password}
					onChange={handleChange}
					required
				/>
				<button type="submit" disabled={loading}>
					{loading ? "Signing up..." : "Signup"}
				</button>
			</form>
			{error && <p style={{ color: "red" }}>{error.message}</p>}
		</div>
	);
}

export default SignupForm;
