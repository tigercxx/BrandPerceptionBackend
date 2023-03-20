# BrandPerception Backend

## Introduction

BrandPerception is an NLP powered tool to assist marketing teams in understanding the market sentiments of their brand.

## Usage

-   Run node index.js to start the application.
-   Connect to the API on port 3000.

## API Endpoints

| HTTP Verbs | Endpoints       | Action                                                                                              |
| ---------- | --------------- | --------------------------------------------------------------------------------------------------- |
| GET        | /reddit         | To retrieve posts with keyword, iphone                                                              |
| POST       | /predict        | To predict the sentiment for 1 sentence                                                             |
| POST       | /predict-file   | To predict the sentiments of a textfile in CRLF or LF and save as CRLF                              |
| POST       | /predict-reddit | To predict the sentiments of a given keyword in posts of a subreddit in CRLF or LF and save as CRLF |

### /reddit

| Query String | Description                                                    | Mandatory? | Example   |
| ------------ | -------------------------------------------------------------- | ---------- | --------- |
| q            | Retrieves posts with these specific keywords                   | Y          | iphone    |
| subreddit    | Retrieves posts in this subreddit with these specific keywords | N          | apple     |
| before       | Retrieves posts before x (s,m,h,d)                             | N          | 2h        |
| after        | Retrieves posts within the past x (s,m,h,d)                    | N          | 4d        |
| score        | Retrieves ones with this score operator. May not be accurate   | N          | (=/>/<) 2 |
| size         | Retrieves stated size. Default is 500 and it is the maximum.   | N          | 50        |

**Example** <br/>
Gets posts with "iphone" in subreddit "apple" between 2 and 4 days ago with score more than or equals to 2, limited to 10.

```
/reddit?subreddit=apple&q=iphone&before=2d&after=4d&score>=2&size=10
```

**Output** <br/>
Data in array with each of the object having

```
'body', 'score', 'author', 'permalink', 'created_utc'
```

### /predict

Reads a sentence. Sends a json output of the data.

Post a body that contains a json to the current endpoint:

```
{
    inputText: "Food is good, but service is bad"
}
```

It returns a json of the following:

```
output = {
    "count": 1,
    "negative": 1,
    "positive": 1,
    "neutral": 0,
    "data":[
        {
            "input": "Food is good, but service is bad",
            "output": {
                "food": "POS",
                "service": "NEG"
            }
        }
    ]
}
```

### /predict-file

Reads a text file where each line contains a sentence. Sends a json output of the data.

Input:

```
Food is good, but service is bad\r\n
Pasta is good, but service is bad\r\n
Mood is good, but service is bad\r\n
Waiter is good, but service is bad\r\n
```

Output:
Same as /predict

### /predict-reddit

Receives a subreddit and a keyword for posts in it. Sends a json output of the data.

```
WIP
```
