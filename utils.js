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

module.exports = {
	writeToFile,
	readFromFile,
};
