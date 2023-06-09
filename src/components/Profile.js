import { useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

import AuthContext from "../store/authContext";

const Profile = () => {
	const { userId, token } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);

	const [posts, setPosts] = useState([]);

	const getUserPosts = useCallback(() => {
		setLoading(true);
		axios
			.get(`http://localhost:8080/userposts/${userId}`)
			.then((res) => {
				setPosts(res.data);
				setLoading(false);
			})
			.catch((err) => console.log(err, "cant' get posts"));
	}, [userId, token]);

	useEffect(() => {
		getUserPosts();
	}, [getUserPosts]);

	const updatePost = (id, status) => {
		axios
			.put(
				`http://localhost:8080/posts/${id}`,
				{ status: !status },
				{
					headers: {
						authorization: token,
					},
				}
			)
			.then(() => {
				getUserPosts();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const deletePost = (id) => {
		axios
			.delete(`http://localhost:8080/posts/${id}`, {
				headers: {
					authorization: token,
				},
			})
			.then(() => {
				getUserPosts();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const mappedPosts = posts.map((post) => {
		return (
			<div key={post.id} className="post-card">
				<h2>{post.title}</h2>
				<h4>{post.user.username}</h4>
				<p>{post.content}</p>
				{userId === post.userId && (
					<div>
						<button
							className="form-btn"
							onClick={() => updatePost(post.id, post.privateStatus)}
						>
							{post.privateStatus ? "make public" : "make private"}
						</button>
						<button
							className="form-btn"
							style={{ marginLeft: 10 }}
							onClick={() => deletePost(post.id)}
						>
							delete post
						</button>
					</div>
				)}
			</div>
		);
	});

	return mappedPosts.length >= 1 && !loading ? (
		<main>{mappedPosts}</main>
	) : (
		<main>
			<h1>{loading ? "Loading..." : "You haven't posted yet!"}</h1>
		</main>
	);
};

export default Profile;
