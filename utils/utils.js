const fs = require('fs');
const os = require('os');
const path = require('path');

const util = require('util');
const execPromise = util.promisify(require('child_process').exec);

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
		.replace(/[^\p{L}\p{N}\s]/gu, '')
		.replace(/[^\w\s]|_/g, ' ') // remove punctuation marks and special characters
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

// To run the Python Script, we will run locally in the current machine
// There needs to be other repo that is working with this project
// To run the script, we will call .bat (windows) or .sh (max/linux)
const runPythonScript = async () => {
	try {
		let stdout, stderr;
		if (os.platform() === 'win32') {
			console.log('Python code running on Windows');
			({ stdout, stderr } = await execPromise('cd ../closedAI/e2e & call work_sentence.bat'));
		} else {
			console.log('Python code running on Mac/linux');
			({ stdout, stderr } = await execPromise(
				'(cd ../closedAI/e2e; source work_sentence.sh)'
			));
		}
		console.log('stdout:', stdout);
		console.log('stderr:', stderr);
	} catch (err) {
		console.error(err);
	}
};

const predict = async (inputText) => {
	// writes text to file. will always replace text. needs to have data and sentence dir
	const filePathTest = path.relative(__dirname, 'data/sentence/test.txt');
	let file = fs.createWriteStream(filePathTest);

	file.on('error', function (err) {
		/* error handling */
		console.log('cannot', err);
	});

	if (Array.isArray(inputText)) {
		console.log('no');
		inputText.forEach(function (v) {
			console.log(v);
			file.write(v + '\r\n');
			console.log('Data has been written to file successfully.');
		});
	} else {
		file.write(inputText + '\r\n');
	}
	file.end();

	await runPythonScript();

	const filePathOutput = path.relative(__dirname, 'data/output/output.json');

	let jsonString = fs.readFileSync(filePathOutput, 'utf8');
	return JSON.parse(jsonString);
};

module.exports = {
	writeToFile,
	readFromFile,
	preprocessing,
	addQueryIntoParams,
	createQuery,
	predict,
};
