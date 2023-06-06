require("dotenv").config();
const { PORT } = process.env;

const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const { sequelize } = require("./util/database");
const { User } = require("./models/user");
const { Post } = require("./models/post");

const {
	getAllPosts,
	getCurrentUserPosts,
	addPost,
	editPost,
	deletePost,
} = require("./controllers/posts");
const { register, login } = require("./controllers/auth");
const { isAuthenticated } = require("./middleware/isAuthenticated");

//AUTH
app.post("/register", register);
app.post("/login", login);

// GET POSTS - no auth
app.get("/posts", getAllPosts);

// CRUD POSTS - auth required
app.get("/userposts/:userId", getCurrentUserPosts);
app.post("/posts", isAuthenticated, addPost);
app.put("/posts/:id", isAuthenticated, editPost);
app.delete("/posts/:id", isAuthenticated, deletePost);

// DB Relations
User.hasMany(Post);
Post.belongsTo(User);

sequelize
	.sync()
	.then(() => {
		app.listen(PORT, () =>
			console.log(`db sync successful & server running on port ${PORT}`)
		);
	})
	.catch((err) => console.log(err));
