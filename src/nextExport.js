const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dir: './src', dev });

module.exports = app;
