let keys;

if (process.env.NODE_ENV === 'production') {
  keys = require('./keys_prod.js');
} else {
  keys = require('./keys_dev.js');
}

Object.keys(keys).forEach(key => {
  process.env[key] = keys[key];
});
