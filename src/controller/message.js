const {ChatMessage, Chat} = require('../mongo/index');
const io = require('../index').io;
//GET ALL BY CHAT
exports.index = (req, res) => {
	ChatMessage.find({chat: req.params.chatId}).populate('user').then(chats => {
		res.status(200).json(chats);
	}).catch(e => {
		res.status(500).json({error: e.message});
	});
};

//CREATE ONE BY CHAT
exports.createOne = async (req, res) => {
	try {
		const chat = await Chat.findById(req.params.chatId);
		if(chat){
			if(req.body.body){
				const message = new ChatMessage({user: req.user.id, chat: req.params.chatId, body: req.body.body});
				message.save().then(newMessage => {
					ChatMessage.populate(newMessage, {path: 'user'}, (err, m) => {
						io.to(`chat-${m.chat}`).emit("new-message", m);
						chat.users.filter(u => u !== req.user.id).forEach(user => {
							io.to(`user-${user._id}`).emit("new-chat-message", m);
						})
						res.status(201).json(m);
					})

				}).catch(e =>  {
					res.status(500).json({error: e.message})
				});
			}
		}else{
			res.status(500).json({error: "wrong chat ID"});
		}
	}catch (e) {
		res.status(500).json({error: e.message});
	}
}
