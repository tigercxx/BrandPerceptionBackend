var { AUTH, SESSION_SECRET } = require('./config/reddit_api.js');

const express = require('express');
const axios = require('axios');
const session = require('express-session');
const querystring = require('querystring');

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

const getRedditToken = async (req) => {
	const options = {
		method: 'POST',
		url: 'https://www.reddit.com/api/v1/access_token',
		headers: {
			Authorization: AUTH,
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		data: querystring.stringify({
			grant_type: 'client_credentials',
		}),
	};
	const response = await axios(options);
	req.session.redditToken = response.data.access_token;
	return response.data.access_token;
};

app.get('/reddit/r/:subreddit', async (req, res) => {
	const token = req.session.redditToken;

	if (token) {
		try {
			const response = await axios.get(
				`https://oauth.reddit.com/r/${req.params.subreddit}/new`,
				{
					headers: {
						'User-Agent': 'brandperception/0.1',
						Authorization: `bearer ${token}`,
					},
				}
			);
			res.send(response.data);
		} catch (error) {
			console.error(error);
			res.status(500).send('An error occurred have token');
		}
	} else {
		try {
			const newToken = await getRedditToken(req);
			const response = await axios.get(
				`https://oauth.reddit.com/r/${req.params.subreddit}/new`,
				{
					headers: {
						'User-Agent': 'brandperception/0.1',
						Authorization: `bearer ${newToken}`,
					},
				}
			);
			res.send(response.data);
		} catch (error) {
			console.error(error);
			res.status(500).send('An error occurred, no token');
		}
	}
});

app.listen(port, () => {
	console.log(`Server listening at http://localhost:${port}`);
});
