const express = require("express");

const { getPosts } = require("./utils/reddit_utils.js");
const { predict } = require("./utils/utils.js");

const app = express();
const port = 4242;

// to process json in express
app.use((req, res, next) => {
    if (req.originalUrl.includes("/webhook")) {
        next();
    } else {
        express.json()(req, res, next);
    }
});

// to process headers from url
app.use(express.urlencoded({ extended: true }));

// enable CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// Predict a single sentence
app.post("/predict", async (req, res) => {
    try {
        console.log("hit");
        let hrTime = process.hrtime();
        let milliseconds = hrTime[0] * 1000 + hrTime[1] / 1000000;
        const result = await predict(req.body.inputText, milliseconds);

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Predict a text file
app.post("/predict-file", async (req, res) => {
    try {
        console.log("hit");
        let hrTime = process.hrtime();
        let milliseconds = hrTime[0] * 1000 + hrTime[1] / 1000000;
        const inputText = req.body;
        console.log(inputText);

        const result = await predict(inputText["body"], milliseconds);
        console.log(result);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Predict an array of sentence
app.post("/predict-reddit", async (req, res) => {
    try {
        console.log("hit");
        let hrTime = process.hrtime();
        let milliseconds = hrTime[0] * 1000 + hrTime[1] / 1000000;
        const response = await getPosts(req, res);

        // get only the posts body
        let postsBody = response.map(({ body }) => body);
        let predictedPostsBody = await predict(postsBody, milliseconds);
        console.log(predictedPostsBody);

        let result = {
            reddit: response,
            predictions: predictedPostsBody,
        };

        res.json(result);
        // res.json({ reddit: null, predictions: null });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});

app.listen(port, () => {
    console.log(`Server listening at ${port}`);
});
