# BrandPerception Backend

## Introduction

BrandPerception is an NLP powered tool to assist marketing teams in understanding the market sentiments of their brand.

## Usage

-   Run node index.js to start the application.
-   Connect to the API on port 3000.

## API Endpoints

| HTTP Verbs | Endpoints        | Action                                 |
| ---------- | ---------------- | -------------------------------------- |
| GET        | /reddit?q=iphone | To retrieve posts with keyword, iphone |

### Querystring for /reddit

| Query String | Description                                                    | Example   |
| ------------ | -------------------------------------------------------------- | --------- |
| q            | Retrieves posts with these specific keywords                   | iphone    |
| subreddit    | Retrieves posts in this subreddit with these specific keywords | apple     |
| before       | Retrieves posts before x (s,m,h,d)                             | 2h        |
| after        | Retrieves posts within the past x (s,m,h,d)                    | 4d        |
| score        | Retrieves ones with this score operator. May not be accurate   | (=/>/<) 2 |
| size         | Retrieves stated size. Default is 500 and it is the maximum.   | 50        |

_Example_
Gets posts with "iphone" in subreddit "apple" between 2 and 4 days ago with score more than or equals to 2, limited to 10.

```
/reddit?subreddit=apple&q=iphone&before=2d&after=4d&score>=2&size=10
```

_Output_
Data in array with each of the object having

```
'body', 'score', 'author', 'permalink', 'created_utc'
```
