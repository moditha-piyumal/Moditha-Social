const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const typeDefs = require("./schema");
const User = require("./models/User");
const Post = require("./models/Post"); // Import Post model
const JWT_SECRET = "your_jwt_secret_key";

mongoose
	.connect(
		"mongodb+srv://piyumalwijeratne:cccxxxzzzCCCXXXZZZ1992@moditha001.cuz29.mongodb.net/socialMediaDB?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => console.log("Connected to MongoDB Atlas"))
	.catch((err) => console.error("MongoDB connection error:", err));

const resolvers = {
	Query: {
		users: async (_, { name }) => {
			const query = name ? { name: { $regex: name, $options: "i" } } : {};
			return await User.find(query);
		},
		user: async (_, { id }) => {
			const user = await User.findById(id);
			if (!user) throw new Error("User not found");

			const posts = await Post.find({ author: id }).sort({ createdAt: -1 });

			// Format the createdAt field for each post and ensure the id field is included
			const formattedPosts = posts.map((post) => ({
				id: post._id.toString(), // Ensure the id field is included and converted to a string
				content: post.content,
				createdAt: new Date(post.createdAt).toISOString(),
			}));

			return {
				id: user.id,
				name: user.name,
				email: user.email,
				posts: formattedPosts,
			};
		},

		getPosts: async () => {
			const posts = await Post.find()
				.populate("author")
				.populate("comments.author")
				.sort({ createdAt: -1 }); // Sort posts by createdAt descending

			return posts.map((post) => ({
				...post._doc,
				id: post._id ? post._id.toString() : "N/A", // Ensure Post.id is valid
				author: post.author
					? {
							id: post.author._id ? post.author._id.toString() : "N/A", // Check author.id safely
							name: post.author.name || "Anonymous",
							email: post.author.email || "no-email@example.com",
					  }
					: { id: "N/A", name: "Deleted User", email: "no-email@example.com" },
				comments: post.comments
					.filter((comment) => comment.author) // Filter out comments with no author
					.map((comment) => ({
						...comment._doc,
						author: comment.author
							? {
									id: comment.author._id
										? comment.author._id.toString()
										: "N/A", // Check comment author.id safely
									name: comment.author.name || "Anonymous",
									email: comment.author.email || "no-email@example.com",
							  }
							: {
									id: "N/A",
									name: "Deleted User",
									email: "no-email@example.com",
							  },
					})),
			}));
		},
	},
	Mutation: {
		signupUser: async (_, { name, email, password }) => {
			const existingUser = await User.findOne({ email });
			if (existingUser) throw new Error("Email is already registered.");

			const hashedPassword = await bcrypt.hash(password, 10);
			const newUser = new User({ name, email, password: hashedPassword });
			await newUser.save();

			const token = jwt.sign(
				{ userId: newUser.id, email: newUser.email },
				JWT_SECRET,
				{ expiresIn: "1h" }
			);
			return { token, user: newUser };
		},
		loginUser: async (_, { email, password }) => {
			const user = await User.findOne({ email }).select("+password");
			if (!user) throw new Error("User not found");

			const isPasswordValid = await bcrypt.compare(password, user.password);
			if (!isPasswordValid) throw new Error("Invalid password");

			const token = jwt.sign(
				{ userId: user.id, email: user.email },
				JWT_SECRET,
				{ expiresIn: "1h" }
			);
			return { token, user };
		},
		updateUser: async (_, { id, name, email }) => {
			// Check if the ID is valid
			if (!mongoose.Types.ObjectId.isValid(id)) {
				throw new Error("Invalid user ID format");
			}

			// Check for duplicate email if email is provided
			if (email) {
				const existingUser = await User.findOne({ email });
				if (existingUser && existingUser.id !== id) {
					throw new Error("Email is already in use.");
				}
			}

			// Update the user's details
			const updatedUser = await User.findByIdAndUpdate(
				id,
				{ name, email },
				{ new: true, runValidators: true }
			);

			if (!updatedUser) {
				throw new Error("User not found");
			}

			return updatedUser;
		},
		createPost: async (_, { content }, context) => {
			// Debug: Log the Authorization header
			console.log("Authorization header:", context.req.headers.authorization);

			// Extract the token
			const token = context.req.headers.authorization;
			if (!token) {
				throw new Error("Authorization token is required");
			}

			// Decode the token
			let userId;
			try {
				const decodedToken = jwt.verify(token.split(" ")[1], JWT_SECRET); // Split 'Bearer' and token
				userId = decodedToken.userId;
			} catch (err) {
				console.error("Token verification error:", err.message); // Debug token errors
				throw new Error("Invalid or expired token");
			}

			// Find the user
			const user = await User.findById(userId);
			if (!user) {
				throw new Error("User not found");
			}

			// Create and save the post
			const newPost = new Post({
				content,
				author: user._id,
			});
			await newPost.save();

			// Populate the author field before returning
			return newPost.populate("author");
		},
		addComment: async (_, { postId, content }, context) => {
			// Ensure user is authenticated
			const token = context.req.headers.authorization;
			if (!token) throw new Error("Authorization required");

			let userId;
			try {
				const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET);
				userId = decoded.userId;
			} catch (err) {
				throw new Error("Invalid or expired token");
			}

			// Find the post
			const post = await Post.findById(postId);
			if (!post) throw new Error("Post not found");

			// Add the comment
			const comment = {
				content,
				author: userId,
				createdAt: new Date(),
			};
			post.comments.push(comment);
			await post.save();

			// Populate the author for the new comment
			return post.populate("comments.author");
		},
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
	introspection: process.env.NODE_ENV === "development", // Enable introspection only in development
	context: ({ req }) => {
		// Debug: Log the headers to ensure they are received
		console.log("Headers received:", req.headers);

		// Pass the request object to the context
		return { req };
	},
});

server.listen().then(({ url }) => console.log(`🚀 Server ready at ${url}`));
