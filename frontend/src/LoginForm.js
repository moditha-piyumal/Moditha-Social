import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom"; // Import useNavigate

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
	const [loginUser, { loading, error }] = useMutation(LOGIN_USER);
	const navigate = useNavigate(); // Initialize useNavigate

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await loginUser({ variables: formData });
			localStorage.setItem("token", response.data.loginUser.token);
			console.log(
				"Login successful, token saved to localStorage:",
				response.data.loginUser.token
			);
			alert("Login successful!");
			navigate("/dashboard"); // Use navigate to redirect
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
