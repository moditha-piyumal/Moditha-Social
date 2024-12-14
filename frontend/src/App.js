import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";

function App() {
	return (
		<Router>
			<div>
				<h1>Welcome to the Social Media App</h1>
				<Routes>
					{/* Default route renders both Login and Signup forms */}
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
					<Route path="/dashboard" element={<Dashboard />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
