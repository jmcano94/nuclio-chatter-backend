const {Chat, User} = require('../mongo/index');
const io = require('../index').io;

//GET ALL
exports.index = (req, res) => {
	Chat.find({users: req.user.id}).populate('users').then(chats => {
		res.status(200).json(chats);
	}).catch(e => {
		res.status(500).json({error: e.message});
	});
};

exports.getOne = (req, res) => {
	Chat.findById(req.params.id).then(chat => {
		res.status(200).json(chat);
	}).catch(e => {
		res.status(500).json({error: e.message});
	})
};

exports.createOne = (req, res) => {
	const authUser = req.user;
	const newChatMembers = req.body.chatMembers;
	if(newChatMembers === undefined || !newChatMembers instanceof Array ||newChatMembers.length === 0){
		res.status(500).json({error: "A chat needs members"});
	}else{
		//filter duplicates
		const noDuplicatesMembers = newChatMembers.reduce((unique, item) => unique.includes(item) ? unique: [...unique, item], []);
		const chat = new Chat({users: [...noDuplicatesMembers, authUser.id]});
		chat.save().then(newChat => {
			User.find({
				'_id': { $in: newChat.users}}).then( users => {
				newChat.users = users;
				users.filter(u => u._id !== req.user.id).forEach(user => {
					io.to(`user-${user._id}`).emit("new-chat", newChat);
				})
				res.status(201).json(newChat);
			});

		}).catch(e =>  {
			res.status(500).json({error: e.message})
		});
	}
}


exports.deleteOne = (req, res) => {
	Chat.deleteOne({_id: req.params.id}).then(result => res.status(204)).catch(e => res.status(500).json({error: e.message}));
}
