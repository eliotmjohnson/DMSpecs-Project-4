import { useState, useEffect, useCallback, createContext } from "react";
import axios from "axios";

let logoutTimer;

const AuthContext = createContext({
	token: "",
	login: () => {},
	logout: () => {},
	userId: null,
});

export const AuthContextProvider = (props) => {
	const [token, setToken] = useState();
	const [userId, setUserId] = useState(null);

	const getLocalData = async () => {
		const storedToken = localStorage.getItem("token");
		let id;
		let exp;

		if (storedToken) {
			await axios
				.post("http://localhost:8080/getData", { storedToken })
				.then((res) => {
					id = res.data.id;
					exp = res.data.exp;
				})
				.catch((error) => console.log(error));
		}

		const remainingTime = calculateRemainingTime(exp);

		if (isNaN(remainingTime)) {
			localStorage.removeItem("token");
			return null;
		}

		logoutTimer = setTimeout(logout, remainingTime);
		setToken(storedToken);
		setUserId(id);
	};

	const calculateRemainingTime = (exp) => {
		const currentTime = new Date().getTime();
		const expTime = exp * 1000;
		const remainingTime = expTime - currentTime;
		return remainingTime;
	};

	useEffect(() => {
		getLocalData();
	}, []);

	const logout = () => {
		setToken(null);
		setUserId(null);
		localStorage.removeItem("token");
		if (logoutTimer) {
			clearTimeout(logoutTimer);
		}
	};

	const login = (token, exp, userId) => {
		setToken(token);
		setUserId(userId);
		localStorage.setItem("token", token);

		const remainingTime = calculateRemainingTime(exp / 1000);

		logoutTimer = setTimeout(logout, remainingTime);
	};

	const contextValue = {
		token,
		login,
		logout,
		userId,
	};

	return (
		<AuthContext.Provider value={contextValue}>
			{props.children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
