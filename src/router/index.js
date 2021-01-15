const {userController, chatController, messageController} = require('../controller');
const express = require('express');

const appRouter = express.Router();

const chatRouter = express.Router();

chatRouter.get('/', chatController.index);
chatRouter.get('/:id', chatController.getOne);
chatRouter.post('/', chatController.createOne);
chatRouter.delete('/:id', chatController.deleteOne);

appRouter.use('/chat', chatRouter);


const userRouter = express.Router();

userRouter.get('/', userController.index);
userRouter.get('/:id', userController.getOne);

appRouter.use('/user', userRouter);

const messageRouter = express.Router();

messageRouter.get('/:chatId', messageController.index);
messageRouter.post('/:chatId', messageController.createOne);

appRouter.use('/message', messageRouter);

module.exports = appRouter;
