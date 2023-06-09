import { useState, useContext } from "react";
import AuthContext from "../store/authContext";
import axios from "axios";

const Auth = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [register, setRegister] = useState(false);
	const [error, setError] = useState({ isError: false, error: "" });
	const authCtx = useContext(AuthContext);

	const submitHandler = (e) => {
		e.preventDefault();

		const body = {
			username,
			password,
		};

		const url = "http://localhost:8080";

		axios
			.post(register ? `${url}/register` : `${url}/login`, body)
			.then(({ data }) => {
				authCtx.login(data.token, data.exp, data.userId);
			})
			.catch((err) => {
				setError((prev) => {
					return { ...prev, isError: true, error: err.response.data };
				});
			});
	};

	return (
		<main>
			<h1>Welcome!</h1>
			<form className="form auth-form" onSubmit={submitHandler}>
				<input
					type="text"
					placeholder="username"
					value={username}
					onChange={(e) => {
						setUsername(e.target.value);
						setError({});
					}}
					className="form-input"
				/>
				<input
					type="password"
					placeholder="password"
					value={password}
					onChange={(e) => {
						setPassword(e.target.value);
						setError({});
					}}
					className="form-input"
				/>
				{error.isError ? <h1 className="error">{error.error}</h1> : ""}
				<button className="form-btn">{register ? "Sign Up" : "Login"}</button>
			</form>
			<button
				className="form-btn"
				onClick={() => {
					setRegister((prev) => !prev);
				}}
			>
				Need to {register ? "Login" : "Sign Up"}?
			</button>
		</main>
	);
};

export default Auth;
