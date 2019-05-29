"use strict";

const mongoose = require("mongoose");
const bcrypt = require("bcrypt"),
	SALT_WORK_FACTOR = 10;
const jwt = require("jsonwebtoken");
const config = require("../../config/config");
const Schema = mongoose.Schema;

// defining all the fields of individual account
const accountsSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true
	},
	hash: String,
	salt: String,
	password: {
		type: String,
		required: true
	},
	role: {
		type: String,
		enum: ["guest", "admin", "company", "user"],
		default: "user"
	},
	accountType: {
		type: String,
		enum: ["premium", "normal"],
		default: "normal"
	},
	accountVerified: {
		type: Boolean,
		default: false
<<<<<<< HEAD
	},
	following: [
		{
			user: {
				type: Schema.ObjectId,
				ref: "Account"
			}
		}
	],
	followers: [
		{
			user: {
				type: Schema.ObjectId,
				ref: "Account"
			}
		}
	],

	friends: [
		{
			user: {
				type: Schema.ObjectId,
				ref: "Account"
			}
		}
	],
	pendingFriends: [
		{
			user: {
				type: Schema.ObjectId,
				ref: "Account"
			}
		}
	]
=======
	}
>>>>>>> c48479f5... nothing speacial
});

accountsSchema.pre("save", function(next) {
	let account = this;

	// only hash the password if it has been modified (or is new)
	if (!account.isModified("password")) return next();

	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
<<<<<<< HEAD
		if (err) {
			return next(err);
		}
=======
		if (err) return next(err);
>>>>>>> c48479f5... nothing speacial

		// hash the password using our new salt
		bcrypt.hash(account.password, salt, function(err, hash) {
			if (err) return next(err);

			// override the cleartext password with the hashed one
			account.password = hash;
			next();
		});
	});
});

accountsSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
<<<<<<< HEAD
		if (err) {
			return cb(err);
		}
=======
		if (err) return cb(err);
>>>>>>> c48479f5... nothing speacial
		cb(null, isMatch);
	});
};

// generating jwt token
accountsSchema.methods.generateJwt = function() {
<<<<<<< HEAD
<<<<<<< HEAD
	console.log("lets token create");
=======
>>>>>>> c48479f5... nothing speacial
	return jwt.sign(
		{
			_id: this._id,
			role: this.role
		},
		config.jwtSecret,
		{
<<<<<<< HEAD
			expiresIn: 60 * 60 * 60 * 24
		}
	);
=======
  return jwt.sign(
    {
      _id: this._id,
      role: this.role
    },
    config.jwtSecret,
    {
      expiresIn: "30d" // 30days
      //60 , "2 days", "10h", "7d"
    }
  );
>>>>>>> b1c1a02e... some issue in account.test.js
=======
			expiresIn: "30d" // 30days
			//60 , "2 days", "10h", "7d"
		}
	);
>>>>>>> c48479f5... nothing speacial
};

module.exports = mongoose.model("Account", accountsSchema);
