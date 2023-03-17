const fs = require('fs');

const writeToFile = (subreddit, data) => {
	fs.writeFile(`data/${subreddit}.json`, JSON.stringify(data), function (err) {
		if (err) {
			console.error(err);
			return;
		}
	});
};

const readFromFile = (subreddit) => {
	const jsonString = fs.readFileSync(`data/${subreddit}.json`, 'utf-8');
	const data = JSON.parse(jsonString);
	return data;
};

const preprocessing = (text) => {
	if (typeof text == 'undefined') {
		return '';
	}

	const cleanedText = text
		.replace(/(https?:\/\/[^\s]+)/g, '') // remove URLs
		.replace(/[\n\t]/g, '') // remove newlines
		.replace(/&gt;/g, '') // remove "&gt;"
		.replace(/[^\w\s]|_/g, ' ') // remove punctuation marks and special characters
		.replace(/[^\p{L}\p{N}\s]/gu, '')
		.replace(/  +/g, ' ')
		.trim(); // remove emojis
	return cleanedText;
};

const addQueryIntoParams = (queryKey, queryValue, resultQuery) => {
	if (queryValue) {
		resultQuery[queryKey] = queryValue;
	}
};

const createQuery = (args) => {
	return (
		'?' +
		Object.entries(args)
			.map(([key, value]) => {
				return key + '=' + value;
			})
			.join('&')
	);
};

module.exports = {
	writeToFile,
	readFromFile,
	preprocessing,
	addQueryIntoParams,
	createQuery,
};
