// next.config.js
const withCSS = require('@zeit/next-css');

const isDev = process.env.NODE_ENV === 'development';
const isStage = process.env.APP_ENV === 'stage';

const ENDPOINT = isDev ? 'http://localhost:4000/graphql' : '/api/graphql';
const CAREER_ENDPOINT = isDev ? 'http://localhost:4000/career' : '/api/career';
const CREDENTIALS = 'include';
let WEBSITE_URL, HOSTNAME;

if (isDev) {
  WEBSITE_URL = 'http://localhost:4000/graphql';
  HOSTNAME = 'http://localhost:3000';
} else if (isStage) {
  WEBSITE_URL = 'https://stagging.reyeselsamad.com/api/graphql';
  HOSTNAME = 'https://stagging.reyeselsamad.com';
} else {
  WEBSITE_URL = 'https://reyeselsamad.com/api/graphql';
  HOSTNAME = 'https://reyeselsamad.com';
}

// fix: prevents error when .css files are required by node
if (typeof require !== 'undefined') {
  require.extensions['.css'] = () => {};
}

module.exports = withCSS({
  distDir: '../build',
  publicRuntimeConfig: {
    // Will be available on both server and client
    ENDPOINT,
    CAREER_ENDPOINT,
    CREDENTIALS,
    WEBSITE_URL,
    HOSTNAME,
  },
});
