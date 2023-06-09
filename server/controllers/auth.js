require("dotenv").config();
const { SECRET } = process.env;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { User } = require("../models/user");

const createToken = (username, id) => {
	return jwt.sign({ username, id }, SECRET, { expiresIn: "1 hour" });
};

module.exports = {
	register: async (req, res) => {
		try {
			const { username, password } = req.body;

			const foundUser = await User.findOne({ where: { username } });

			if (foundUser) {
				res.status(400).send("Username already exists");
			} else {
				const salt = bcrypt.genSaltSync(10);
				const hash = bcrypt.hashSync(password, salt);

				const newUser = await User.create({
					username: username,
					hashedPass: hash,
				});

				const token = createToken(
					newUser.dataValues.username,
					newUser.dataValues.id
				);

				const exp = Date.now() + 1000 * 60 * 60;

				res.status(200).send({
					username: newUser.dataValues.username,
					userId: newUser.dataValues.id,
					token,
					exp,
				});
			}
		} catch (error) {
			console.log(error);
			res.status(400).send("Failed to register user");
		}
	},

	login: async (req, res) => {
		try {
			const { username, password } = req.body;

			const foundUser = await User.findOne({ where: { username } });

			if (foundUser) {
				const isAuthenticated = bcrypt.compareSync(
					password,
					foundUser.hashedPass
				);

				if (isAuthenticated) {
					const token = createToken(foundUser.username, foundUser.id);

					const exp = Date.now() + 1000 * 60 * 60;

					res.status(200).send({
						username: foundUser.username,
						userId: foundUser.id,
						token,
						exp,
					});
				} else {
					res.status(400).send("User name or password incorrect");
				}
			} else {
				res.status(400).send("User name or password incorrect");
			}
		} catch (error) {
			console.log(error);
			res.status(500).send("Login system is having some issues");
		}
	},

	getTokenData: (req, res) => {
		const token = req.body.storedToken;
		const data = jwt.verify(token, SECRET);
		res.status(200).send(data);
	},
};
