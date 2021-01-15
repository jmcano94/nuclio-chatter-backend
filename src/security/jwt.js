const jwtMiddleware = require('express-jwt');
const {User} = require('../mongo');
const jwtSecret = process.env.JWT_SECRET
const jwt = require('jsonwebtoken');

const jwtVerifier = (token,callback) => {
	jwt.verify(token, jwtSecret, callback);
}

const configSecurity = (app, io) => {
	app.use("/",jwtMiddleware({ secret: jwtSecret, algorithms: ['HS256']}).unless({path: ['/login', '/register']}));
	app.post('/login', async (req, res) => {
		const { email, password } = req.body;

		User.findOne({email})
			.then(user => {
				if (!user) return res.status(400).json({error: {email: 'This email is not registered' }});

				//validate password
				if (!user.comparePassword(password)) return res.status(400).json({error: {password: 'Wrong password' }});

				// Login successful, write token, and send back user
				res.status(200).json({token: user.generateJWT(), user: {id: user._id, name: user.name, email: user.email}});
			})
			.catch(err => res.status(500).json({message: err.message}));
	});

	app.post('/register',(req, res) => {
		// Make sure this user doesn't already exist
		User.findOne({email: req.body.email})
			.then(user => {

				if (user) return res.status(400).json({error: {email: 'This email is already registered.'}});

				// Create and save the user
				const newUser = new User(req.body);
				newUser.save()
					.then(user =>{
						io.emit("new-user", {_id: user._id, name: user.name, email: user.email});
						res.status(200).json({token: user.generateJWT(), user: {id: user._id, name: user.name, email: user.email}});
					} )
					.catch(err => res.status(500).json({message:err.message}));
			})
			.catch(err => res.status(500).json({success: false, message: err.message}));
	});
}

module.exports = {
	configSecurity,
	jwtVerifier
}
