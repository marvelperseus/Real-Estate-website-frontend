import React from 'react';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';
import HeartOutlineIcon from '@material-ui/icons/FavoriteBorder';
import HeartIcon from '@material-ui/icons/Favorite';

const styles = theme => ({
  infoBar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '57px',
    borderBottom: '1px solid rgba(0,0,0,.1)',
    fontSize: '.8rem',
    backgroundColor: '#fff',
    fontWeight: 300,
  },
  infoBarEmphasis: {
    fontSize: '1.5rem',
  },
  infoBarItem: {
    marginRight: '25px',
    '&:last-of-type': {
      marginRight: '0',
    },
  },
  likeItem: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5px 10px',
    border: '1px solid rgba(0,0,0,.2)',
    borderRadius: '20px',
    cursor: 'pointer',
  },
  heartIconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '5px',
  },
  heartIcon: {
    fontSize: '1rem',
    color: theme.frontEnd.colors.primary.main,
  },
});

@withStyles(styles)
class InfoBar extends React.Component {
  render() {
    const { classes, listing } = this.props;
    const {
      price,
      rentalOrSale,
      isLiked,
      beds,
      baths,
      neighborhood,
      sqFootage,
    } = listing;

    const isRental = rentalOrSale === 'rental';

    return (
      <div className={classes.infoBar}>
        <span className={classes.infoBarItem}>
          <span className={classes.infoBarEmphasis}>${price}</span>
          {isRental ? '/month' : null}
        </span>
        <span className={classnames(classes.infoBarItem, classes.likeItem)}>
          <span className={classes.heartIconWrapper}>
            {isLiked ? (
              <HeartIcon
                color="inherit"
                classes={{ root: classes.heartIcon }}
              />
            ) : (
              <HeartOutlineIcon
                color="inherit"
                classes={{ root: classes.heartIcon }}
              />
            )}
          </span>
          Favorite
        </span>
        <span className={classes.infoBarItem}>
          {beds} {beds > 1 ? 'beds' : 'bed'}
        </span>
        <span className={classes.infoBarItem}>
          {baths} {baths > 1 ? 'baths' : 'bath'}
        </span>
        <span className={classes.infoBarItem}>{neighborhood}</span>
        {sqFootage && Number(sqFootage) ? (
          <span className={classes.infoBarItem}>
            <span className={classes.infoBarEmphasis}>
              {Number(sqFootage).toLocaleString()}
            </span>{' '}
            Sq. Ft.
          </span>
        ) : null}
      </div>
    );
  }
}

export default InfoBar;
