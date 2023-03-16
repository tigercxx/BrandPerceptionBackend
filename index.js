const express = require('express');
const session = require('express-session');

const { getPosts } = require('./reddit_utils.js');
var { SESSION_SECRET } = require('./config/reddit_api.js');

const app = express();
const port = 3000;

// Set up session middleware
app.use(
	session({
		secret: SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
	})
);

app.get('/reddit/', async (req, res) => {
	let response = await getPosts(req, res);
	res.send(response);
});

app.listen(port, () => {
	console.log(`Server listening at ${port}`);
});
