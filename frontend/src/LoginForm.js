import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";

// GraphQL mutation for login
const LOGIN_USER = gql`
	mutation LoginUser($email: String!, $password: String!) {
		loginUser(email: $email, password: $password) {
			token
			user {
				id
				name
				email
			}
		}
	}
`;

function LoginForm() {
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await loginUser({ variables: formData });
			console.log("Login successful:", response.data.loginUser);
			alert("Login successful!");
			// Save token to localStorage
			localStorage.setItem("token", response.data.loginUser.token);
		} catch (err) {
			console.error("Login error:", err.message);
		}
	};

	return (
		<div>
			<h2>Login</h2>
			<form onSubmit={handleSubmit}>
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
					{loading ? "Logging in..." : "Login"}
				</button>
			</form>
			{error && <p style={{ color: "red" }}>{error.message}</p>}
		</div>
	);
}

export default LoginForm;
