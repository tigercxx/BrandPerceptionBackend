const axios = require('axios');

const { preprocessing, addQueryIntoParams, createQuery } = require('./utils.js');

const getPosts = async (req, res) => {
	const { question, subreddit, before, after, score, size } = req.query;

	const queryParams = {};
	addQueryIntoParams(
		'filter',
		['body', 'score', 'author', 'permalink', 'created_utc'],
		queryParams
	);

	addQueryIntoParams('q', question, queryParams);
	addQueryIntoParams('subreddit', subreddit, queryParams);
	addQueryIntoParams('before', before, queryParams);
	addQueryIntoParams('after', after, queryParams);
	addQueryIntoParams('score', score, queryParams);
	addQueryIntoParams('size', typeof size !== 'undefined' ? size : '500', queryParams);

	const url = 'https://api.pushshift.io/reddit/search/comment';

	try {
		const response = await axios.get(url + createQuery(queryParams));
		let data = response.data['data'];
		for (let i = 0; i < data.length; i++) {
			data[i]['body'] = preprocessing(data[i]['body']);
			const date = new Date(data[i]['created_utc'] * 1000);
			data[i]['created_utc'] = date.toLocaleString();
		}
		return data;
	} catch (error) {
		console.error(error);
		res.status(500).send('An error has occurred');
	}
};

module.exports = {
	getPosts,
};
