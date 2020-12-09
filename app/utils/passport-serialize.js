const User = require('../models/user');

const user = {
  serialize: (user, done) => {
  	console.log('serialize: ' + user._id)
    done(null, user.id)
  },
  deserialize: (id, done) => {
  	console.log('deserialize: ' + id)
    User.findOne({_id: id}, function(err, user) {
    	done(err, user);
  	});
	}
}

module.exports = user;