const jwt = require('jsonwebtoken');

exports.setUserInfo = (request) => {
  const getUserInfo = {
    _id: request._id
  };

  return getUserInfo;
};

// Generate JWT
exports.generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
}

const http = require('http');
const https = require('https');

exports.getContent = (url) => {

  // return new pending promise
  return new Promise((resolve, reject) => {
    // select http or https module, depending on reqested url
    const lib = url.startsWith('https') ? https : http;
    const request = lib.get(url, (response) => {

      // handle http errors
      if (response.statusCode < 200 || response.statusCode > 299) {
        console.log(`utils/index.js > 31`);
         reject(new Error(`Failed to load page, status code: ${response.statusCode}`));
       }
      // temporary data holder
      let data = "";
      // on every content chunk, push it to the data array
      response.on('data', (chunk) => data += chunk );
      // we are done, resolve promise with those joined chunks
      response.on('end', () => {
        data = JSON.parse(data);
        // console.log('utils/index.js > 24');
        // console.log(data);

        if (!data) {
          reject(data);
        } else {
          resolve(data);
        }
      });
    });
    // handle connection errors of the request
    request.on('error', (err) => {
      console.log('utils/index.js > 53');
      console.log(url);
      console.log(err);
      reject(err);
    });
  });
};
