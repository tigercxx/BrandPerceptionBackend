const express = require('express');
const session = require('express-session');

const { getPostsWithKeywordInSubreddit, getPostsWithKeyword } = require('./reddit_utils.js');
var { SESSION_SECRET } = require('./config/reddit_api.js');

const app = express();
const port = 3000;

const url = 'http://localhost:3000';

// Set up session middleware
app.use(
	session({
		secret: SESSION_SECRET,
		resave: false,
		saveUninitialized: true,
	})
);

app.get('/reddit/r/:subreddit/q/:question', async (req, res) => {
	let response = await getPostsWithKeywordInSubreddit(req, res);
	res.send(response);
});

app.get('/reddit/q/:question', async (req, res) => {
	let response = await getPostsWithKeyword(req, res);
	res.send(response);
});

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
