const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ }, // Basic email regex
	password: { type: String, required: true, minlength: 8 }, // Minimum password length
});

// Create the User model
const User = mongoose.model("User", userSchema);

module.exports = User;
