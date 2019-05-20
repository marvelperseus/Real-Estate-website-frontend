// eslint-disable function-paren-newline
import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';
import flush from 'styled-jsx/server';
import JssProvider from 'react-jss/lib/JssProvider';
import { extractCritical } from 'emotion-server';
import getPageContext from '../lib/getPageContext';

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet();
    const pageContext = getPageContext();
    const page = renderPage(App => props =>
      sheet.collectStyles(
        <JssProvider
          registry={pageContext.sheetsRegistry}
          generateClassName={pageContext.generateClassName}
        >
          <App pageContext={pageContext} {...props} />
        </JssProvider>
      )
    );
    const styles = extractCritical(page.html);
    const styleTags = sheet.getStyleElement();
    return {
      ...page,
      pageContext,
      styleTags,
      ...styles,
      styles: (
        <React.Fragment>
          <style
            id="jss-server-side"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: pageContext.sheetsRegistry.toString(),
            }}
          />
          {flush() || null}
        </React.Fragment>
      ),
    };
  }

  constructor(props) {
    super(props);
    const { __NEXT_DATA__, ids } = props;
    if (ids) {
      __NEXT_DATA__.ids = ids;
    }
  }

  render() {
    const { pageContext } = this.props;

    return (
      <html lang="en">
        <Head>
          <meta charSet="utf-8" />
          {/* Use minimum-scale=1 to enable GPU rasterization */}
          <meta
            name="viewport"
            content={
              'user-scalable=0, initial-scale=1, ' +
              'minimum-scale=1, width=device-width, height=device-height'
            }
          />
          <meta
            name="theme-color"
            content={pageContext.theme.palette.primary.main}
          />
          <link
            href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.7.3/antd.min.css"
            type="text/css"
            rel="stylesheet"
          />
          <link
            href="https://api.tiles.mapbox.com/mapbox-gl-js/v0.53.0/mapbox-gl.css"
            rel="stylesheet"
          />
          <link
            rel="stylesheet"
            href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-geocoder/v2.3.0/mapbox-gl-geocoder.css"
            type="text/css"
          />
          <style dangerouslySetInnerHTML={{ __html: this.props.css }} />
          {this.props.styleTags}
          <link
            rel="stylesheet"
            type="text/css"
            href="/_next/static/style.css"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
