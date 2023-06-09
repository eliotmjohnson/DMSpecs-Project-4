import { useState, useEffect, useContext } from "react";
import axios from "axios";

import AuthContext from "../store/authContext";

const Home = () => {
	const { userId, token } = useContext(AuthContext);

	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (token) {
			setLoading(true);
			axios
				.get("http://localhost:8080/posts")
				.then((res) => {
					setPosts(res.data);
					setLoading(false);
				})
				.catch((err) => {
					console.log(err, "cant' get posts");
				});
		}
	}, [userId, token]);

	const mappedPosts = posts.map((post) => {
		return (
			<div key={post.id} className="post-card">
				<h2>{post.title}</h2>
				<h4>{post.user.username}</h4>
				<p>{post.content}</p>
			</div>
		);
	});

	return mappedPosts.length >= 1 && token ? (
		<main>{mappedPosts}</main>
	) : (
		<main>
			{loading ? (
				<h1>Loading...</h1>
			) : (
				<h1>
					{token
						? "There are no posts yet!"
						: "You need to login first to see posts!"}
				</h1>
			)}
		</main>
	);
};

export default Home;
