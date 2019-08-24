const Account = require("./account.model");
	
	const register = async (req, res, next) => {
		const account = new Account({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			password: req.body.password,
			contactNo: req.body.contactNo
		});

		account
			.save()
			.then( () => {
				let result = this.data;
				
				// token = account.generateJwt();
				// host = req.get('host');
				// link = "http://localhost:4040/api/v1/account/verify/id/" + token;
				// let mailOptions = {
				// 	to: req.body.email,
				// 	subject: "Please confirm your Email account",
				// 	html: "Hello,<br> Please Click on the link to verify your email.<br><a href=" + link + ">Click here to verify</a>"
				// };
				// console.log(mailOptions);

				// smtpTransport.sendMail(mailOptions)
				// 	.then(response=>{
				// 		console.log(response.message);
				// 	})
				// 	.catch(error=>{
				// 		console.log(error);
				// 	});

					let resss= {
						result: result,
						// token: token
					};
					console.log(resss);
					return result;
				
					
					})
				.catch(err => {
				// console.log(err);
				res.status(500).json({
					error: err
				});
			});
};

module.exports = {
	register
}