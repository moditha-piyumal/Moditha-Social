const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");

mongoose
	.connect(
		"mongodb+srv://piyumalwijeratne:cccxxxzzzCCCXXXZZZ1992@moditha001.cuz29.mongodb.net/socialMediaDB?retryWrites=true&w=majority",
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("MongoDB connection error:", err));

const seedPosts = async () => {
	try {
		// Fetch all users from the database
		const users = await User.find();
		if (users.length === 0) {
			throw new Error("No users found. Please create at least one user first!");
		}

		// Create dummy posts for each user
		const dummyPosts = users.map((user, index) => ({
			content: `Hello, this is post number ${index + 1} by ${user.name}!`,
			author: user._id, // Assign the actual user's ID
		}));

		// Insert the posts into the database
		await Post.insertMany(dummyPosts);
		console.log("Dummy posts created successfully!");
	} catch (error) {
		console.error("Error seeding posts:", error.message);
	} finally {
		mongoose.connection.close();
	}
};

seedPosts();
