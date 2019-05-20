const app = require('../../nextExport');
const router = require('express').Router();
const { isAuthorizedMiddleware } = require('../customMiddleware/auth');
const routes = require('../../routes');
const handle = routes.getRequestHandler(app);

router.get('/agent', (req, res, next) => {
  if (!req.query.id) {
    res.redirect('/agents');
    return;
  }
  handle(req, res);
});

router.get(/^\/app\/?$/, isAuthorizedMiddleware, (req, res) => {
  if (!req.canAccessBackend) return res.redirect('/');
  if (req.isAdmin) return res.redirect('/app/admin-area/dashboard');
  return res.redirect('/app/dashboard');
});

router.get('/app/*', isAuthorizedMiddleware, (req, res) => {
  if (!req.canAccessBackend) return res.redirect('/');
  handle(req, res);
});

router.get(
  ['/sign-up', '/log-in'],
  isAuthorizedMiddleware,
  (req, res, next) => {
    if (req.isAuthorized) return res.redirect('back');
    handle(req, res);
  }
);

router.get(['/_next/*', '/static/*'], (req, res) => {
  handle(req, res);
});

router.get('*', isAuthorizedMiddleware, (req, res) => {
  if (req.canAccessBackend) {
    if (req.isAdmin) return res.redirect('/app/admin-area/dashboard');
    return res.redirect('/app/dashboard');
  }
  handle(req, res);
});

module.exports = router;
