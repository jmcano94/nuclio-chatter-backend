require("./connection");
const User = require("./schemas/user.js");
const ChatMessage = require("./schemas/message.js");
const Chat = require("./schemas/chat.js");

module.exports = {
	User,
	Chat,
	ChatMessage
}

