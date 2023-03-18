const express = require('express');
var os = require('os');
const fs = require('fs');
const util = require('util');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const execPromise = util.promisify(require('child_process').exec);

const { getPosts } = require('./utils/reddit_utils.js');

const app = express();
const port = 4242;

// to process json in express
app.use((req, res, next) => {
	if (req.originalUrl.includes('/webhook')) {
		next();
	} else {
		express.json()(req, res, next);
	}
});

// to process headers from url
app.use(express.urlencoded({ extended: true }));

// enable CORS
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

app.get('/reddit/', async (req, res) => {
	let response = await getPosts(req, res);
	res.send(response);
});

// To run the Python Script, we will run locally in the current machine
// There needs to be other repo that is working with this project
// To run the script, we will call .bat (windows) or .sh (max/linux)
const runPythonScript = async () => {
	try {
		let stdout, stderr;
		if (os.platform() === 'win32') {
			({ stdout, stderr } = await execPromise('cd ../closedAI/e2e & call work_sentence.bat'));
		} else {
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

// Predict a single sentence
app.post('/predict', async (req, res) => {
	let result = null;
	try {
		const inputText = await req.body.inputText;
		console.log(inputText);
		// writes text to file. will always replace text. needs to have data and sentence dir
		fs.writeFile('../data/sentence/test.txt', inputText, (err) => {
			if (err) {
				console.log(error);
				return;
			}
			console.log('Data has been written to file successfully.');
		});
		await runPythonScript();

		fs.readFile('../data/output/output.json', 'utf8', (error, data) => {
			if (error) {
				console.log(error);
				return;
			}
			console.log('Output written to output.json');
			result = JSON.parse(data);
			res.json(result);
		});
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

// Predict a text file
app.post('/predict_text', upload.single('avatar'), (req, res) => {
	try {
		const inputText = req.file;
		console.log(inputText);
		console.log(req.body);
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

// Predict an array of sentence

app.listen(port, () => {
	console.log(`Server listening at ${port}`);
});
