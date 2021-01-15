const express = require("express");
require("dotenv").config();
const app = express();
const cors = require('cors');
app.use(cors())
const bodyParser = require("body-parser");
const {configSecurity} = require('./security/jwt');
const server = app.listen(3001, () => {
	console.log('server is running on port', server.address().port);
});
const socket = require('./socket');
const io = socket(server);
exports.io = io;
const appRouter = require('./router');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
configSecurity(app,io);
app.use("/",appRouter);







