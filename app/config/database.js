'use strict';

module.exports = {
  'url' : process.env.MONGO_URI,
  options: {
		keepAlive: 1,
		connectTimeoutMS: 30000,
		reconnectTries: Number.MAX_VALUE,
		reconnectInterval: 1000,
		useNewUrlParser: true
		}
};
