var { SESSION_SECRET } = require('./config/reddit_api.js');

const express = require('express');
const session = require('express-session');
const { getPostsFromSubreddit, getCommentsFromPost } = require('./reddit_utils.js');
const { readFromFile } = require('./utils.js');

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

app.get('/reddit/r/:subreddit', async (req, res) => {
	let response = await getPostsFromSubreddit(req, res);
	res.send(response);
});

app.get('/reddit/r/:subreddit/read', async (req, res) => {
	let response = await readFromFile(req.params.subreddit);
	res.send(response);
});

app.get('/reddit/r/:subreddit/comments/:postid', async (req, res) => {
	let response = await getCommentsFromPost(req, res);
	res.send(response);
});

app.get('/reddit/comments/:postid', async (req, res) => {
	let response = await getCommentsFromPost(req, res);
	res.send(response);
});

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
