const {User} = require('../mongo/index');
//GET ALL
exports.index = (req, res) => {
	User.find().then(users => {
		res.status(200).json(users);
	}).catch(e => {
		res.status(500).json({error: e.message});
	});
};

exports.getOne = (req, res) => {
	User.findById(req.params.id).then(user => {
		res.status(200).json(user);
	}).catch(e => {
		res.status(500).json({error: e.message});
	})
};
