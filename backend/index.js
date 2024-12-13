const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const typeDefs = require("./schema");
const User = require("./models/User");
// SENSITIVE
const JWT_SECRET = "your_jwt_secret_key"; // Replace with a secure secret in production

mongoose
	.connect(
		// SENSITIVE
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
			return await User.findById(id);
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
		// Other mutations (signupUser, loginUser, etc.)
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
	},
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => console.log(`🚀 Server ready at ${url}`));
