const express = require("express");

const { getPosts } = require("./utils/reddit_utils.js");
const fs = require("fs");
const util = require("util");
const exec = util.promisify(require("child_process").exec);

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

async function runpython() {
    try {
        const { stdout, stderr } = await exec(
            "(cd ../closedAI/e2e; source work_sentence.sh)"
        );
        console.log("stdout:", stdout);
        console.log("stderr:", stderr);
    } catch (err) {
        console.error(err);
    }
}

// Predict a single sentence
app.post("/predict", async (req, res) => {
    result = null;
    try {
        const inputText = await req.body.inputText;
        console.log(inputText);
        // writes text to file. will always replace text. needs to have data and sentence dir
        fs.writeFile("../data/sentence/test.txt", inputText, (err) => {
            if (err) {
                throw err;
            }
        });
        console.log("Data has been written to file successfully.");
        await runpython();
        console.log("Output written to output.json");

        fs.readFile("../data/output/output.json", "utf8", (error, data) => {
            if (error) {
                console.log(error);
                return;
            }
            // console.log(JSON.parse(data));
            result = JSON.parse(data);
            res.json(result);
        });
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
