import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

// Create an Apollo Client instance
const client = new ApolloClient({
	uri: "http://localhost:4000", // Replace with your GraphQL server URL
	cache: new InMemoryCache(),
});

export default function ApolloProviderWrapper({ children }) {
	return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
