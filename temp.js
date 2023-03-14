var request = require('request');
var options = {
	method: 'POST',
	url: 'https://www.reddit.com/api/v1/access_token',
	headers: {
		Authorization:
			'Basic NDVZY0NrektnNE5QSFpMV0ZxdmxhZzpRQ1JNTTFjb2tRTzBlOHBBMm5XajRYeThwckc2alE=',
		'Content-Type': 'application/x-www-form-urlencoded',
		Cookie: 'edgebucket=cxkQnpKF4kO6SDeV8P',
	},
	form: {
		grant_type: 'client_credentials',
	},
};
request(options, function (error, response) {
	if (error) throw new Error(error);
	console.log(response.body);
});
