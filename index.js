const express = require('express');

const { getPosts } = require('./reddit_utils.js');

const app = express();
const port = 3000;

app.get('/reddit/', async (req, res) => {
	let response = await getPosts(req, res);
	res.send(response);
});

app.listen(port, () => {
	console.log(`Server listening at ${port}`);
});
