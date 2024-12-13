import React from "react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";

function App() {
	return (
		<div>
			<h1>Welcome to the Social Media App</h1>
			<SignupForm />
			<hr />
			<LoginForm />
		</div>
	);
}

export default App;
