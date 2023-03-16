const axios = require('axios');
const querystring = require('querystring');

const { writeToFile } = require('./utils.js');
var { AUTH } = require('./config/reddit_api.js');

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

const getPostsFromSubreddit = async (req, res) => {
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
			writeToFile(req.params.subreddit, response.data);
			return response.data;
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
			writeToFile(req.params.subreddit, response.data);
			return response.data;
		} catch (error) {
			console.error(error);
			res.status(500).send('An error occurred, no token');
		}
	}
};

module.exports = {
	getPostsFromSubreddit,
};
