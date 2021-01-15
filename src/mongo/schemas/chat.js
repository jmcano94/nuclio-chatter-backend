const mongoose = require('mongoose');

const schema = new mongoose.Schema({
	users: [{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}]
}, {timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }});


const Chat = mongoose.model('Chat', schema);



module.exports = Chat;
