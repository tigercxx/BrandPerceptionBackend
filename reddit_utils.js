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
	let token = req.session.redditToken;
	if (typeof token == 'undefined') {
		token = await getRedditToken(req);
	}

	try {
		const response = await axios.get(`https://oauth.reddit.com/r/${req.params.subreddit}/new`, {
			headers: {
				'User-Agent': 'brandperception/0.1',
				Authorization: `bearer ${token}`,
			},
		});
		writeToFile(req.params.subreddit, response.data);
		return response.data;
	} catch (error) {
		console.error(error);
		res.status(500).send('An error occurred have token');
	}
	return;
};

const getCommentsFromPost = async (req, res) => {
	let token = req.session.redditToken;
	if (typeof token == 'undefined') {
		token = await getRedditToken(req);
	}

	try {
		let url = `https://oauth.reddit.com/comments/${req.params.postid}`;
		if (typeof req.params.subreddit !== 'undefined') {
			url = `https://oauth.reddit.com/r/${req.params.subreddit}/comments/${req.params.postid}`;
		}

		const response = await axios.get(url, {
			headers: {
				'User-Agent': 'brandperception/0.1',
				Authorization: `bearer ${token}`,
			},
		});
		return response.data;
	} catch (error) {
		console.error(error);
		res.status(500).send('An error occurred have token');
	}
};

module.exports = {
	getPostsFromSubreddit,
	getCommentsFromPost,
};
