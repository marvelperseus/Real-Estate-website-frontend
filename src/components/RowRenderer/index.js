import React from 'react';

let ReactDataGrid;
let Row;

if (typeof window !== 'undefined') {
  const PropTypes = require('prop-types');
  // next line is only required until ron-react-autocomplete is rebuilt and republished
  PropTypes.component = PropTypes.element;
  require('react').PropTypes = PropTypes;
  require('react').createClass = require('create-react-class');
  ReactDataGrid = require('react-data-grid');
  Row = ReactDataGrid.Row;
}

class RowRenderer extends React.Component {
  setScrollLeft = scrollBy => {
    // if you want freeze columns to work, you need to make sure you implement this as apass through
    this.row.setScrollLeft(scrollBy);
  };

  getRowStyle = () => ({
    backgroundColor: this.getRowBackground(),
  });

  getRowBackground = () => (
    this.props.idx % 2 ? '#ECEBFE' : '#fff'
  );

  getClassName = () => (
    this.props.idx % 2 ? 'evenRow customRow' : 'oddRow customRow'
  );

  render() {
    // here we are just changing the style
    // but we could replace this with anything we liked, cards, images, etc
    // usually though it will just be a matter of wrapping a div, and then calling back through to the grid
    return (
      <div className={this.getClassName()}>
        <Row ref={node => this.row = node} {...this.props} />
      </div>
    );
  }
}

export default RowRenderer;
