const routes = require('next-routes')();

routes
  .add('home', '/', '/')
  .add('dashboard', '/app/dashbaord', 'app/dashboard')
  .add('profile', '/app/profile', 'app/profile')
  .add('deals', '/app/deals', 'app/deals')
  .add('invoices', '/app/invoices', 'app/invoices')
  .add('agents', '/app/agents', 'app/agents')
  .add('view-listings', '/app/listings', '/app/listings')
  .add('create-listing', '/app/listing/new', '/app/listing/new')
  .add(
    'admin-dashboard',
    '/app/admin-area/dashboard',
    'app/admin-area/dashboard'
  )
  .add(
    'create-agent',
    '/app/admin-area/agents/create',
    'app/admin-area/agents/create'
  )
  .add(
    'view-agents',
    '/app/admin-area/agents/view',
    'app/admin-area/agents/view'
  )
  .add(
    'create-user',
    '/app/admin-area/customers/create',
    'app/admin-area/customers/create'
  )
  .add(
    'view-customers',
    '/app/admin-area/customers/view',
    'app/admin-area/customers/view'
  )
  .add(
    'create-admin',
    '/app/admin-area/admin/create',
    'app/admin-area/admin/create'
  )
  .add('view-admin', '/app/admin-area/admin/view', 'app/admin-area/admin/view')
  .add('view-deals', '/app/admin-area/deals/view', 'app/admin-area/deals/view')
  .add(
    'admin-view-listings',
    '/app/admin-area/listings/view',
    'app/admin-area/listings/view'
  )
  .add(
    'admin-view-developments',
    '/app/admin-area/developments/view',
    'app/admin-area/developments/view'
  )
  /*
  .add(
    'view-invoices',
    '/app/admin-area/invoices/view',
    'app/admin-area/invoices/view'
  )
  */
  .add('log-in', '/log-in')
  .add('sign-up', '/sign-up')
  .add('listings', '/listings')
  .add('listing', '/listing')
  .add('agent', '/agent')
  .add('agents-front-end', '/agents', '/agents')
  .add('new-developments', '/new-developments')
  .add('apply', '/apply')
  .add('about', '/about');

module.exports = routes;
