import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Create an HTTP link to your GraphQL server
const httpLink = createHttpLink({
	uri: "http://localhost:4000", // Replace with your backend URL
});

// Use setContext to include the Authorization header in every request
const authLink = setContext((_, { headers }) => {
	// Retrieve the token from localStorage
	const token = localStorage.getItem("token");
	console.log("Token found in localStorage:", token); // Debugging
	return {
		headers: {
			...headers,
			Authorization: token ? `Bearer ${token}` : "",
		},
	};
});

// Create Apollo Client with the authLink and httpLink
const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
});

export default function ApolloProviderWrapper({ children }) {
	return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
