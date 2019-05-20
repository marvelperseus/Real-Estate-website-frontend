import { Fragment } from 'react';
import Head from 'next/head';
import { withRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ActiveLink = withRouter(({ children, router, href }) => {
  return (
    <li class={router.pathname === href ? 'active' : ''}>
      <a href={href}>{children}</a>
    </li>
  );
});



export default ({ children, UserStore, title, href }) => {
  return (
    <Fragment>
      <Head>
        <link
          href="/static/css/font-awesome-4.7.0/css/font-awesome.css"
          rel="stylesheet"
        />
        <link href="/static/css/bootstrap.min.css" rel="stylesheet" />
        <link href="/static/css/style.css?v=1.1.1" rel="stylesheet" />
        <link href="/static/css/responsive.css?v=1.8" rel="stylesheet" />
      </Head>
      <Header UserStore={UserStore} />
      <section class="terms-main">
        <h3>{title}</h3>
        <div class="navigate">
          <ul>
            <ActiveLink href="/terms-services">
              Terms Of Service
            </ActiveLink>
            <ActiveLink  href="/privacy">
              Privacy Policy
            </ActiveLink>
            <ActiveLink  href="/fair">
              Fair Housing
            </ActiveLink>
            <ActiveLink href="/dmca">
              DMCA
            </ActiveLink>
          </ul>
        </div>
      </section>
      <section class="simple-page">
        <div class="container">{children}</div>
      </section>
      <Footer />
    </Fragment>
  );
};
