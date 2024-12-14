import React from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("token"); // Remove the token
		alert("Logged out successfully!");
		navigate("/login"); // Redirect to login
	};

	return (
		<div>
			<h2>Dashboard</h2>
			<p>Welcome to the dashboard!</p>
			<button onClick={handleLogout}>Logout</button>
		</div>
	);
}

export default Dashboard;
