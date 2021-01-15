const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	body: { type: String, required: true},
	user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	chat: {type: mongoose.Schema.Types.ObjectId,ref: 'Chat', required: true}
}, {timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});


const ChatMessage = mongoose.model('ChatMessage', schema);



module.exports = ChatMessage;
