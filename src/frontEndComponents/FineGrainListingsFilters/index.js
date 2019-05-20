import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import MainListingFilters from '../MainListingFilters';

const styles = theme => ({
  root: {
    display: 'flex',
    height: '46px',
    justifyContent: 'flex-end',
    alignItems: 'center',
    minWidth: '540px',
    backgroundColor: '#fff',
  },
  filterItem: {
    display: 'flex',
    height: '100%',
    paddingLeft: '15px',
    paddingRight: '15px',
    alignItems: 'center',
    fontSize: '0.9rem',
    color: 'rgba(0,0,0,.7)',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'transparent',
    transition: 'color .2s ease-in-out',
    '&:hover': {
      color: 'rgba(0,0,0,.9)',
      '& span svg': {
        backgroundColor: 'rgba(0,0,0,.6)',
      },
    },
  },
  expandArrowWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '15px',
    overflow: 'visible',
  },
  expandArrow: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '20px',
    width: '20px',
    fontSize: '1.1rem',
    backgroundColor: 'rgba(0,0,0,.4)',
    color: '#fff',
    borderRadius: '50%',
    padding: '2px',
    paddingTop: '4px',
    overflow: 'visible',
    transition: 'background-color .2s ease-in-out',
  },
  mainFilters: {
    marginRight: 'auto',
    paddingLeft: '15px',
  },
});

@observer
@withStyles(styles)
class FineGrainListingsFilters extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentOpenFilter: '',
    };
  }
  render() {
    const { classes, onFilterClick } = this.props;
    const { currentOpenFilter } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.mainFilters}>
          <MainListingFilters />
        </div>
        <button
          className={classes.filterItem}
          id="neighborhood"
          onClick={onFilterClick}
        >
          Neighborhood
          <span className={classes.expandArrowWrapper}>
            <ArrowDownIcon color="inherit" classes={{ root: classes.expandArrow }} />
          </span>
        </button>
        <button
          className={classes.filterItem}
          id="price"
          onClick={onFilterClick}
        >
          Price
          <span className={classes.expandArrowWrapper}>
            <ArrowDownIcon color="inherit" classes={{ root: classes.expandArrow }} />
          </span>
        </button>
        <button
          className={classes.filterItem}
          id="beds"
          onClick={onFilterClick}
        >
          Beds
          <span className={classes.expandArrowWrapper}>
            <ArrowDownIcon color="inherit" classes={{ root: classes.expandArrow }} />
          </span>
        </button>
        <button
          className={classes.filterItem}
          id="baths"
          onClick={onFilterClick}
        >
          Baths
          <span className={classes.expandArrowWrapper}>
            <ArrowDownIcon color="inherit" classes={{ root: classes.expandArrow }} />
          </span>
        </button>
        <button
          className={classes.filterItem}
          id="filters"
          onClick={onFilterClick}
        >
          Filters
          <span className={classes.expandArrowWrapper}>
            <ArrowDownIcon color="inherit" classes={{ root: classes.expandArrow }} />
          </span>
        </button>
      </div>
    );
  }
}

export default FineGrainListingsFilters;
