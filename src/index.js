const express = require("express");
const cors = require('cors');
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const configureSockets = require("./socket");
dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
const server = app.listen(process.env.PORT, () => {
	console.log('server is running on port', process.env.PORT);
});


exports.io = configureSockets(server);

const {configSecurity, authRouter} = require('./security/jwt');
const appRouter = require('./router');

configSecurity(app);
require('./socket');

app.use("/",appRouter);
app.use("/", authRouter);









