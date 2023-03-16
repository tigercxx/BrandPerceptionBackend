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

module.exports = {
	writeToFile,
	readFromFile,
	preprocessing,
};
