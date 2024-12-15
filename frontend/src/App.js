import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";
import PrivateRoute from "./PrivateRoute"; // Import PrivateRoute
import "./App.css"; // Import the global CSS

function App() {
	return (
		<Router>
			<div>
				<h1>Welcome to Moditha Social</h1>
				<Routes>
					<Route
						path="/"
						element={
							<div>
								<SignupForm />
								<hr />
								<LoginForm />
							</div>
						}
					/>
					<Route path="/signup" element={<SignupForm />} />
					<Route path="/login" element={<LoginForm />} />
					{/* Protect the dashboard route */}
					<Route
						path="/dashboard"
						element={
							<PrivateRoute>
								<Dashboard />
							</PrivateRoute>
						}
					/>
				</Routes>
			</div>
		</Router>
	);
}

export default App;
