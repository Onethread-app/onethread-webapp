const jwt = require('jwt-simple');
const redis = require("redis");
const Account = require("./account.model");
const smtpTransport = require("../helpers/sendmail");
const authService = require('../services/auth.services');
const bcryptService = require('../services/bcrypt.services');
const config = require('../../config/config');

// Declaring all variables
let token = '';
let rand = '';
let link = '';
let host = '';

// const rediscl = redis.createClient();
// rediscl.on("connect", function () {
//     console.log("Redis plugged in.");
// });

const sendJSONresponse = function (res, status, content) {
	res.status(status);
	res.json(content);
};

const tokenForUser = function (user) {
	const timestamp = new Date().getTime();
	return jwt.encode({
		sub: user.id,
		iat: timestamp
	}, config.jwtSecret);
}; 
const register = async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	const firstName = req.body.firstName;
	const lastName = req.body.lastName;
	const contactNo = req.body.contactNo;
	const role = req.body.role;

	if (!email || !password) {
		return sendJSONresponse(res, 422, {
			error: 'You must provide email and password.'
		});
	}

	Account.find({
			email: email
		})
		.exec()
		.then(user => {
			console.log(user);
			if (user.length >= 1) {
				return res.status(409).json({
					message: "email is already exits"
				});
			} else {
				let account = new Account();
				account.email = email;
				account.firstName = firstName;
				account.lastName = lastName;
				account.contactNo = contactNo;
				account.role = role;
				account.password = password;
				token = account.generateJwt();
				account.token = token;
				account
					.save()
					.then(() => {
						 return sendJSONresponse(res, 201, {
							success: true,
							token: token,
							message: "User created"
						})
					}).then(() => {
						host = req.get('host');
						link = "http://localhost:4040/api/v1/account/verify/id/" + token;
						let mailOptions = {
							to: email,
							subject: "Please confirm your Email account",
							html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
						};
						console.log(mailOptions);
						smtpTransport.sendMail(mailOptions, function (err, res) {
							if (err) {
								console.log(err);
							} else {
								console.log("Message sent: " + res);
								res.end({
									success: true,
									msg: "sent"
								});
							}
						})
					})
			};
		}).catch(err => {
			res.status(500).json({
				error: err
			});
		});
};

/**
 * Returns jwt token if valid username and password is provided
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
const login = async (req, res) => {
	console.log(req.user._id);
	res.send({
		success: true, 
		token: tokenForUser(req.user)
	});
};

// let's logout
const logout = async (req, res) => {
	req.logout();
	res.json({
		success: true,
		msg: 'You are successfully logout'
	});
	res.end();
};

/**
 * Change password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
const changePassword = async () => {};

// find account for account verification
const findAccount = async (email) => {
	// return new Promise((resolve, reject) => {
	//   Account.findOne({
	//       email
	//     },
	//     "password loginAttempts blockExpires name email role verified verification",
	//     (err, item) => {
	//       utils.itemNotFound(err, item, reject, "USER_DOES_NOT_EXIST");
	//       resolve(item);
	//     }
	//   );
	// });
};

const forgetPassword = async (req, res) => {
	// try {
	//   const locale = req.getLocale();
	//   const data = matchedData(req);
	//   await findAccount(data.email);
	//   const item = await saveForgotPassword(req);
	//   emailer.sendResetPasswordEmailMessage(locale, item);
	//   res.status(200).json(forgotPasswordResponse(item));
	// } catch (error) {
	//   res.json(error);
	// }
};

// send confirmation mail to the account hodler

const confirmationMail = async (req, res) => {
	// let rand = Math.floor(Math.random() * 100 + 54);
	// let host = req.get("host");
	// let link = "http://" + req.get("host") + "/verify?id=" + rand;

	// const mailOptions = {
	//   to: req.query.to,
	//   subject: "Please confirm your Email account",
	//   html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
	//     link +
	//     ">Click here to verify</a>"
	// };
	// console.log(mailOptions);
	// smtpTransport.sendMail(mailOptions, function (error, response) {
	//   if (error) {
	//     console.log(error);
	//     res.end("error");
	//   } else {
	//     console.log("Message sent: " + response.message);
	//     res.end("sent");
	//   }
	// });
};

const verifyAccount = async (req, res) => {
	// console.log(req.protocol + ":/" + req.get("host"));
	// if (req.protocol + "://" + req.get("host") == "http://" + host) {
	//   console.log("Domain is matched. Information is from Authentic email");
	//   if (req.query.id == rand) {
	//     console.log("email is verified");
	//     res.end("<h1>Email " + mailOptions.to + " is been Successfully verified");
	//   } else {
	//     console.log("email is not verified");
	//     res.end("<h1>Bad Request</h1>");
	//   }
	// } else {
	//   res.end("<h1>Request is from unknown source");
	// }
};

const followAccount = (req, res) => {
	let reqUserID = req.user.id;
	let reqQueryID = req.query.id;
	// check if you follow yourself
	if (reqUserID === reqQueryID) {
		return res.status(400).json({
			success: false,
			msg: "You cannot follow yourself"
		});
	}
	Account.findById(reqQueryID)
		.then(account => {
			//console.log(account);
			// check if the requested user is already in follower list
			if (account.followers.filter(follower =>
					follower.user.toString() === reqUserID).length > 0) {
				return res.status(400).json({
					success: false,
					msg: "You already followed the user"
				});
			}
			account.followers.unshift({
				user: reqUserID
			});
			account.save();
			Account.findOne({
					email: req.user.email
				})
				.then(account => {
					account.following.unshift({
						user: reqQueryID
					});
					account.save().then(user => res.json(user));
				})
				.catch(err => res.status(404).json({
					success: false,
					msg: "you already follow the user"
				}));
		});
};

const removeFollowing = (req, res, next) => {
	let reqUserID = req.user.id;
	let unfollowId = req.query.id;
	console.log(reqUserID, unfollowId);
	Account.findByIdAndUpdate(reqUserID, {
		$pull: {
			"followers": {
				"user": reqUserID
			}
		}
	}, (err, result) => {
		if (err) {
			return res.status(400).json({
				error: (err)
			});
		}
		next();
	});
};

const removeFollower = (req, res) => {
	let reqUserID = req.user.id;
	let unfollowId = req.query.id;
	console.log(reqUserID, unfollowId);
	Account.findByIdAndUpdate(unfollowId, {
			$pull: {
				"followers": {
					"user": reqUserID
				}
			}
		}, {
			new: true
		})
		.populate('following', '_id')
		.populate('followers', '_id')
		.exec((err, result) => {
			if (err) {
				return res.status(400).json({
					error: (err)
				});
			}
			res.status(200).json({
				success: true,
				msg: "unfollow successfully done",
				result: result
			});
		});
};

// send friend request to an account
const sendFriendRequest = async (req, res) => {
	let fromFriend = req.user.id;
	let toFriend = req.query.userID;
	Account.findById(toFriend)
		.then(account => {
			console.log(account);
			if (account.pendingFriends.filter(friend =>
					friend.user.toString() === fromFriend).length > 0) {
				return res.status(400).json({
					success: false,
					msg: "this id is already in your pending list"
				});
			}
			account.pendingFriends.unshift({
				user: fromFriend,
				status: "pending"
			});
			account.save();
			Account.findOne({
				email: req.user.email
			}).then(account => {
				account.friends.unshift({
					user: toFriend
				});
				account.save().then(user => res.json({
					sucess: true,
					msg: "request is sent to the user",
					friendinfo: user
				}));

			}).catch(err => res.status(404).json({
				success: false,
				msg: "you already in his pendinglist",
				error: err
			}));
		});

};

// check in pending request the id exist or not
const pendingFriendRequestList = async (req, res) => {
	let reqUserID = req.user.id;
	Account.findById(reqUserID)
		.then(account => {
			let pendingList = account.pendingFriends;
			let listPendingReq = [];
			pendingList.forEach((value, key) => {

				listPendingReq.push(value.user);

			});
			return res.status(200).json({
				success: true,
				msg: "pending friend request list",
				list: listPendingReq
			});

		});
};

// Accept Friend request
const acceptFriendRequest = async (req, res) => {
	let reqUserID = req.user.id;
	let reqQueryID = req.query.userID;
	console.log(reqUserID, reqQueryID);

	Account.findById(reqUserID)
		.then(account => {
			account.friends.unshift({
				user: reqQueryID
			});
			account.save();
			Account.findByIdAndUpdate(reqUserID, {
					$pull: {
						"pendingFriends": {
							"user": reqQueryID
						}
					}
				}, (err, result) => {
					if (err) {
						return res.status(400).json({
							error: err
						});
					}
					res.status(200).json({
						success: true,
						msg: "you both conenct with each other"
					});
				}

			);
		});
	Account.findById(reqQueryID)
		.then(account => {
			account.friends.unshift({
				user: reqUserID
			});
			account.save();
		});

};

// reject friend request
const rejectFriendRequest = async (req, res) => {
	let reqUserID = req.user.id;
	let reqQueryID = req.query.userID;
	console.log(reqUserID, reqQueryID);

	Account.findById(reqUserID)
		.then(account => {
			Account.findByIdAndUpdate(reqUserID, {
					$pull: {
						"pendingFriends": {
							"user": reqQueryID
						}
					}
				}, (err, result) => {
					if (err) {
						return res.status(400).json({
							error: err
						});
					}
					res.status(200).json({
						success: true,
						msg: "successfully reject the user",
						result: result
					});
				}

			);
		});
};

// remove friend from friend list
const removeFriend = async (req, res) => {
	let reqUserID = req.user.id;
	let reqQueryID = req.query.userID;
	Account.findByIdAndUpdate(reqUserID, {
		$pull: {
			"friends": {
				"user": reqQueryID
			}
		}
	}, (err, result) => {
		if (err) {
			return res.status(400).json({
				error: err
			});
		}
		Account.findByIdAndUpdate(reqQueryID, {
			$pull: {
				"friends": {
					"user": reqUserID
				}
			}
		}, (err, result) => {
			if (err) {
				return res.status(400).json({
					error: err
				});
			}
			res.status(200).json({
				success: true,
				msg: "unfriend successful",
				result: result
			});
		});
	});

};

const getAllAccounts = async (req, res) => {
	console.log(req.user);

};

const getAccount = async (req, res) => {
	let accountInfo = req.account;
	return sendJSONresponse(res, 200, {
		sucess: true,
		msg: accountInfo
	})
};

const accountLoad = async (req, res, next, id) => {

	Account.findById(id)
		.exec()
		.then(result => {

			if (result) {
				req.account = result;
				return next();
			} else {

				return res.status(400)
					.json({
						message: "No valid entry found for provided ID"
					});
			}
		})
		.catch(err => {
			// console.log(err);
			next(err);
		});
}

const searchAccount = async (req, res) => {

};
module.exports = {
	sendJSONresponse,
	register,
	login,
	logout,
	changePassword,
	forgetPassword,
	confirmationMail,
	verifyAccount,
	followAccount,
	pendingFriendRequestList,
	searchAccount,
	getAllAccounts,
	getAccount,
	accountLoad,
	sendFriendRequest,
	removeFollowing,
	removeFollower,
	acceptFriendRequest,
	rejectFriendRequest,
	removeFriend
};