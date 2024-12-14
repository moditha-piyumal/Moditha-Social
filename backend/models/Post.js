const mongoose = require("mongoose");

// Define the Post schema
const postSchema = new mongoose.Schema(
	{
		content: { type: String, required: true },
		author: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true }
);

// Create the Post model
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
