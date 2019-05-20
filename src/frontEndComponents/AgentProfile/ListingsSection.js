import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import ListingCard from '../ListingCard';

const styles = theme => ({
  root: {
    height: '100%',
    width: '100%',
    padding: '20px',
    backgroundColor: '#fff',
    color: 'rgba(0,0,0,.7)',
    border: '1px solid rgba(0,0,0,.1)',
  },
  lisingsOptions: {
    display: 'flex',
    paddingLeft: '15px',
    paddingRight: '15px',
    justifyContent: 'center',
    alignItems: 'center',
    height: '48px',
    width: '100%',
    fontSize: '0.9rem',
    backgroundColor: 'rgb(244, 245, 249)',
  },
  listingsWrapper: {
    padding: '10px 10px 20px 10px',
    overflow: 'auto',
  },
  descriptionTitle: {
    display: 'flex',
    justifyContent: 'center',
    padding: '20px 10px',
    paddingTop: '0',
    flexDirection: 'row',
    marginBottom: '20px',
    fontSize: '1.5rem',
    fontWeight: '600',
    borderBottom: '1px solid rgba(0,0,0,.1)',
  },
  imageWrapperClassName: {
    height: 180,
    [theme.breakpoints.only('sm')]: {
      height: 240,
    },
    [theme.breakpoints.only('xs')]: {
      height: 180,
    },
  },
});

const containerComponent = ({ children, ...props }) => (
  <div style={{ height: '100%', overflow: 'auto' }} {...props}>
    {children}
  </div>
);

@observer
@withStyles(styles)
class ListingsSection extends Component {
  renderListings = (listingItems, imageWrapperClassName) =>
    listingItems.map(listingItem => {
      const {
        featuredPhotoURL,
        otherPhotoURLs,
        address,
        neighborhood,
        price,
        beds,
        baths,
        isLiked,
        isNoFee,
        monthsOfFreeRent,
        sqFootage,
        type,
        id,
      } = listingItem;

      return (
        <Grid item xs={12} sm={6} md={3}>
          <ListingCard
            featuredPhotoURL={featuredPhotoURL}
            otherPhotoURLs={otherPhotoURLs}
            address={address}
            neighborhood={neighborhood}
            price={price}
            beds={beds}
            baths={baths}
            isLiked={isLiked}
            isNoFee={isNoFee}
            monthsOfFreeRent={monthsOfFreeRent}
            sqFootage={sqFootage}
            type={type}
            id={id}
            imageWrapperClassName={imageWrapperClassName}
          />
        </Grid>
      );
    });

  render() {
    const { classes, listings } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.descriptionTitle}>Related Listings</div>
        <div className={classes.listingsWrapper}>
          <Grid container spacing={24} component={containerComponent}>
            {listings &&
              this.renderListings(listings, classes.imageWrapperClassName)}
          </Grid>
        </div>
      </div>
    );
  }
}

export default ListingsSection;
