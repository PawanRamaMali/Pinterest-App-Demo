const Pin = require('../models/pin');
const User = require('../models/user');
const utils = require('../utils');

// Get all pins
exports.getAllPins = (req, res, next) => {
  console.log('getAllPins');
  Pin.find()
    .sort({createdAt: -1})
  	.then((pins) => {
    	return res.status(200).json({ pins });
  	})
  	.catch((err) => {
  		console.log(`pin.ctrl.js > getAllPins: ${err}`);
  		return handleError(res, err);
  	});
};

// Get all pins for one user. params = userId
exports.getUserPins = (req, res, next) => {
  console.log(`pin.ctrl.js > getUserPins: ${req.params.userId}`);
  Pin.find({ userId: req.params.userId })
    .sort({createdAt: -1})
    .then((pins) => {
      return res.status(200).json({ pins });
    })
    .catch((err) => {
      console.log(`pin.ctrl.js > getUserPins: ${err}`);
      return handleError(res, err);
    });
};

// Get a single pin by id. params = pinId
exports.getPinById = (req, res, next) => {
  Pin.findOne({ _id: req.params.pinId })
    .then((pin) => {
      return res.status(200).json({ pin });
      })
    .catch(err => {
      console.log(`pin.ctrl.js > getPinById: ${err}`);
      return handleError(res, err);
    });
};

// search for images, returns array of 24 images that match search keyword
// from flickr api
exports.searchImage = (req, res, next) => {
  const { keyword } = req.params;

  const FLICKR_API_ENDPOINT = process.env.FLICKR_API_ENDPOINT;
  const FLICKR_API_KEY = process.env.FLICKR_API_KEY;
  const FLICKR_SECRET = process.env.FLICKR_SECRET;

  const url = `${FLICKR_API_ENDPOINT}&api_key=${FLICKR_API_KEY}&tags=${keyword.replace(" ", ",")}&per_page=24&format=json&content_type=1&nojsoncallback=1&safe_search=1&sort=relevance`;

  console.log(url);

  utils.getContent(url)
    .then((results) => {
        if (!results.photos.photo) {
          const err = {
            message: `Error searching for "${keyword}": No Results`
          }
          console.log(`pin.ctrl.js > searchImage 61: ${err}`);
          return handleError(res, err);
        }
        const images = results.photos.photo.map(item => {
          return {
           "id": item.id,
           "url": `https://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}_m.jpg`,
           "snippet": item.title,
           "thumbnail" : `https://farm${item.farm}.staticflickr.com/${item.server}/${item.id}_${item.secret}_t.jpg`,
           "context" : `https://www.flickr.com/photos/${item.owner}/${item.id}`
          }});
        const baseUrl = `${req.protocol}://${req.get('host')}${req.baseUrl}${req.path}`;
        images.baseUrl = baseUrl;
        return res.status(200).json({ images });
    })
    .catch((err) => {
      console.log(err);
      console.log(`pin.ctrl.js > searchImage 76: ${err}`);
      return handleError(res, err);
    });
};

// add new pin. body: { title, url, userId, userName, userAvatarUrl }
exports.addPin = (req, res, next) => {
  const pin = req.body;
  // console.log(pin);

    const newPin = new Pin({
      title: pin.title,
      description: pin.description,
  		imageUrl: pin.imageUrl,
      siteUrl: pin.siteUrl,
  		userId: pin.userId,
  		userName: pin.userName,
  		userAvatarUrl: pin.avatarUrl
    });
    console.log(newPin);

    newPin.save()
	    .then((pin) => {
	      console.log('new pin saved');
	      console.log(pin);
	      return res.status(200).json({
	          message: 'Pin saved successfully',
	          pin
	        });
	    })
	    .catch((err) => {
	      console.log(`pin.ctrl.js > addPin: ${err}`);
      return handleError(res, err);
	    });
}

// Deletes a pin from the DB
exports.removePin = (req, res, next) => {
  Pin.findOne({ _id: req.params.pinId })
    .then((pin) => {
      if (!pin) {
        return res.status(404).json({message: 'Pin not found.'});
      } else {
        // Only owner can delete
        if (pin.userId.toString() === req.user._id.toString()) {
          pin.remove((err) => {
            if (err) {
              return handleError(res, err);
            } else {
              return res.status(204).json({message: `${pin.title} was deleted.`});
            }
          });
        } else {
          return res.status(403).json({message: 'You do not have permission to delete this item.'});
        }
      }
  })
  .catch((err) => {
      console.log('pin.ctrl.js > 93');
      console.log(err);
      return handleError(res, err);
    });
}

const handleError = (res, err) => {
  return res.status(500).json({message: err});
}

