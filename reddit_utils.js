const axios = require('axios');
const { preprocessing } = require('./utils.js');

const getPostsWithKeywordInSubreddit = async (req, res) => {
	try {
		const response = await axios.get(
			`https://api.pushshift.io/reddit/search/comment?q=${req.params.question}&subreddit=${req.params.subreddit}&size=500&filter=body,score,author,permalink,created_utc`
		);
		let data = response.data['data'];
		for (let i = 0; i < data.length; i++) {
			data[i]['body'] = preprocessing(data[i]['body']);
			const date = new Date(data[i]['created_utc'] * 1000);
			data[i]['created_utc'] = date.toLocaleString();
		}
		return data;
	} catch (error) {
		console.error(error);
		res.status(500).send('An error occurred have token');
	}
};

const getPostsWithKeyword = async (req, res) => {
	try {
		const response = await axios.get(
			`https://api.pushshift.io/reddit/search/comment?q=${req.params.question}&size=500&filter=body,score,author,permalink,created_utc`
		);
		let data = response.data['data'];
		for (let i = 0; i < data.length; i++) {
			data[i]['body'] = preprocessing(data[i]['body']);
			const date = new Date(data[i]['created_utc'] * 1000);
			data[i]['created_utc'] = date.toLocaleString();
		}
		return data;
	} catch (error) {
		console.error(error);
		res.status(500).send('An error occurred have token');
	}
};

module.exports = {
	getPostsWithKeywordInSubreddit,
	getPostsWithKeyword,
};
