const CLIENT_URL = process.env.NODE_ENV === 'production' ? process.env.APP_HOST : 'http://localhost:3000';

// REDIRECT HASH
//   Purpose: catch client-side routes that don't exist on the back-end.
//   Parameterizes the URL and redirects to root `/` route + hash fragment
//   consisting of the client route parameters.
//   For ex. /viewpost/bc37599dd92b8a2007161fc3
//   Is redirected to: /#/redirect=viewpost/bc37599dd92b8a2007161fc3
//   Client picks off the hash fragment and executes the route.
//
exports.redirectHash = (req, res) => {
  console.log('redirectHash');
  // keep only keys with `truthy` values (not undefined)
  const params_keys = Object.keys(req.params).filter( el => req.params[el] );

  let hash_string = '#/redirect=';

  // build hash from request parameters
  params_keys.forEach( (key, index) => {

    // only prepend with slash if the key is not the first key
    if (index !== 0) { hash_string += '/'; }
    // append the request parameter
    hash_string += `${req.params[key]}`;

  });

  // send the redirect
  console.log(`redirecting to ${hash_string}`);
  res.redirect(302, `${CLIENT_URL}/${hash_string}`);
}