import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
	// Check for token in localStorage
	const token = localStorage.getItem("token");
	console.log("Token found in localStorage:", token);

	// If no token, redirect to login
	if (!token) {
		alert("You must be logged in to access this page!");
		console.log("Redirecting to /login because no token was found.");
		return <Navigate to="/login" />;
	}

	// Otherwise, render the protected component
	return children;
};

export default PrivateRoute;
