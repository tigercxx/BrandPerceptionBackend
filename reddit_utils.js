const axios = require('axios');
const { preprocessing } = require('./utils.js');

const getPostsWithKeywordInSubreddit = async (req, res) => {
	try {
		const response = await axios.get(
			`https://api.pushshift.io/reddit/search/comment?q=${req.params.question}&subreddit=${req.params.subreddit}&size=500`
		);
		let data = response.data['data'];
		let posts = [];
		for (let i = 0; i < data.length; i++) {
			posts.push(preprocessing(data[i]['body']));
		}
		return posts;
	} catch (error) {
		console.error(error);
		res.status(500).send('An error occurred have token');
	}
};

const getPostsWithKeyword = async (req, res) => {
	try {
		const response = await axios.get(
			`https://api.pushshift.io/reddit/search/comment?q=${req.params.question}&size=500`
		);
		let data = response.data['data'];
		let posts = [];
		for (let i = 0; i < data.length; i++) {
			posts.push(preprocessing(data[i]['body']));
		}
		return posts;
	} catch (error) {
		console.error(error);
		res.status(500).send('An error occurred have token');
	}
};

module.exports = {
	getPostsWithKeywordInSubreddit,
	getPostsWithKeyword,
};
