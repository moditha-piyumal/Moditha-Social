import React from "react";
import ReactDOM from "react-dom/client";
import ApolloProviderWrapper from "./ApolloClient";
import App from "./App";

// Use createRoot for rendering
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<ApolloProviderWrapper>
			<App />
		</ApolloProviderWrapper>
	</React.StrictMode>
);
