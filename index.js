const express = require('express');

const { getPosts } = require('./utils/reddit_utils.js');

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));

app.get('/reddit/', async (req, res) => {
	let response = await getPosts(req, res);
	res.send(response);
});

// Predict a single sentence
app.post('/predict', async (req, res) => {
	try {
		const inputText = await req.body.inputText;
		res.json({
			test: inputText,
		});
	} catch (error) {
		console.error(error);
		res.status(500).send('Internal Server Error');
	}
});

// Predict a text file

// Predict an array of sentence

app.listen(port, () => {
	console.log(`Server listening at ${port}`);
});
