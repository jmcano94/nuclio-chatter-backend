const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({
	email: { type: String, required: true, unique: true},
	password: {type: String, required: true},
	name: {type: String, required: true}
}, {timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});

schema.pre('save',  function(next) {
	const user = this;

	if (!user.isModified('password')) return next();

	bcrypt.genSalt(10, function(err, salt) {
		if (err) return next(err);

		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);

			user.password = hash;
			next();
		});
	});
});

schema.methods.comparePassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

schema.methods.generateJWT = function() {
	const today = new Date();
	const expirationDate = new Date();
	expirationDate.setDate(today.getDate() + 60);

	let payload = {
		id: this._id,
		email: this.email,
		name: this.name,
	};

	return jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: parseInt(expirationDate.getTime() / 1000, 10)
	});
};

const User = mongoose.model('User', schema);



module.exports = User;
