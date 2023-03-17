const express = require("express");

const { getPosts } = require("./utils/reddit_utils.js");

const app = express();
const port = 4242;

app.use((req, res, next) => {
    if (req.originalUrl.includes("/webhook")) {
        next();
    } else {
        express.json()(req, res, next);
    }
});
app.use(express.urlencoded({ extended: true }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.get("/reddit/", async (req, res) => {
    let response = await getPosts(req, res);
    res.send(response);
});

// Predict a single sentence
app.post("/predict", async (req, res) => {
    try {
        const inputText = await req.body.inputText;
        res.json({
            test: inputText,
        });
        console.log(inputText);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// Predict a text file

// Predict an array of sentence

app.listen(port, () => {
    console.log(`Server listening at ${port}`);
});
