import React, { Component } from 'react';
import moment from 'moment';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import IconButton from 'material-ui/IconButton';
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import Chance from 'chance';
import Select from 'react-select';
import ListingCard from '../ListingCard';

const chance = new Chance();

const styles = theme => ({
  root: {
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
    color: 'rgba(0,0,0,.7)',
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
  nolistingstitle: {
    margin: '0px auto',
    textAlign: 'center',
    padding: '20px',
  },
  listingsWrapper: {
    padding: '20px',
    paddingBottom: '0',
    height: 'calc(100% - 48px)',
    overflow: 'auto',
  },
});

const containerComponent = ({ children, ...props }) => (
  <div style={{ height: '100%', overflow: 'auto' }} {...props}>
    {children}
  </div>
);

const selectStyles = {
  container: (base, state) => ({
    ...base,
    width: '200px',
    cursor: 'pointer',
    minHeight: '30px !important',
    height: '30px !important',
  }),
  control: (base, state) => ({
    ...base,
    cursor: 'pointer',
    minHeight: '30px !important',
    height: '30px !important',
    backgroundColor: '#fff',
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      borderRadius: '4px',
    };
  },
};

const sortingTypes = [
  { value: JSON.stringify({}), label: 'Default Sort' },
  { value: JSON.stringify({ price: 1 }), label: 'Price - Low to High' },
  { value: JSON.stringify({ price: -1 }), label: 'Price - High to How' },
  {
    value: JSON.stringify({ createdAt: -1 }),
    label: 'Listed Date- Most Recent',
  },
  {
    value: JSON.stringify({ neighborhood: 1 }),
    label: 'Neighborhood - A to Z',
  },
  { value: JSON.stringify({ address: 1 }), label: 'Address - A to Z' },
];

@observer
@withStyles(styles)
class ListingsSection extends Component {
  constructor(props) {
    super(props);
  }
  componentWillReceiveProps(props) {
    this.setState({ selectedItem: this.props.selectedItem });
  }
  flyToStore(listingItem) {
    this.setState({ selectedItem: listingItem.properties.address });

    this.props.flyToStore(listingItem);
  }

  onSelectChange = event => {
    const { value } = event.target;
    this.setState({ value });
    const { onOrderBy } = this.props;
    onOrderBy(value);
  };

  renderListingCards = (listingItems, selectedItem, rentMainRef) => {
    let that = this;
    return listingItems.map(listingItem => {
      const {
        featuredPhotoURL,
        otherPhotoURLs,
        address,
        neighborhood,
        borough,
        price,
        beds,
        baths,
        isLiked,
        isNoFee,
        monthsOfFreeRent,
        sqFootage,
        type,
        listingID,
        images,
        offer,
      } = listingItem.properties;

      return (
        <ListingCard
          offer={offer}
          rentMainRef={rentMainRef}
          featuredPhotoURL={images[0]}
          otherPhotoURLs={otherPhotoURLs}
          address={address}
          neighborhood={neighborhood}
          borough={borough}
          price={price}
          beds={beds}
          baths={baths}
          isLiked={isLiked}
          isNoFee={isNoFee}
          monthsOfFreeRent={monthsOfFreeRent}
          sqFootage={sqFootage}
          type={type}
          key={listingID}
          id={listingID}
          flyToStore={() => that.flyToStore(listingItem)}
          selectedItem={selectedItem}
          listingItem={listingItem}
        />
      );
    });
  };

  renderListingTable = listingItems => {
    let that = this;
    return (
      <div className="cust-sc">
        <table id="musicinfo">
          <thead>
            <tr>
              <th>Address</th>
              <th>Neighborhood</th>
              <th>Price</th>
              <th>Beds</th>
              <th>Baths</th>
              <th>Broker Fee</th>
              <th>Status</th>
              <th>Available On</th>
            </tr>
          </thead>
          <tbody>
            {listingItems.map(listingItem => {
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
                images,
                moveInDate,
              } = listingItem.properties;
              return (
                <tr key={id}>
                  <td>{address}</td>
                  <td>{neighborhood}</td>
                  <td>${price}</td>
                  <td>{beds} Bed</td>
                  <td>{baths} Bath</td>
                  <td>Fee</td>
                  <td>Active</td>
                  <td>{moment(moveInDate).format('YYYY-MM-DD')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  render() {
    const {
      classes,
      orderby,
      listings,
      count,
      setSortingType,
      selectedItem,
      isCardType,
      setCardType,
      pagination,
    } = this.props;

    const { nextDisabled, prevDisabled, goToPage, page } = pagination;
    const PAGE_LENGTH = 5;
    return (
      <div className="city-middle">
        <div className="city-detail">
          <div className="head-sec">
            <h4>
              New York {' '}
              <span>
                {page * PAGE_LENGTH + 1}-{page * PAGE_LENGTH + listings.length}{' '}
                of {count} Listings{' '}
              </span>
            </h4>
            <div className="choice-optin">
              <div className="all-list">
                <button
                  onClick={() => setCardType(true)}
                  className={
                    isCardType
                      ? 'grid_view propertyView active'
                      : 'grid_view propertyView'
                  }
                >
                  <i className="fa fa-th" aria-hidden="true" />
                </button>
                <button
                  onClick={() => setCardType(false)}
                  id="music"
                  style={{ marginRight: '5px' }}
                  className={
                    isCardType
                      ? 'list_view propertyView'
                      : 'list_view propertyView active'
                  }
                >
                  <i className="fa fa-list" aria-hidden="true" />
                </button>
                <label style={{ marginRight: '5px' }}>sort by</label>
                <select
                  onChange={this.onSelectChange}
                  value={orderby}
                  style={{ marginRight: '5px' }}
                >
                  {sortingTypes.map(item => {
                    return (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    );
                  })}
                </select>
              </div>
              {prevDisabled || (
                <IconButton onClick={() => goToPage('prev')}>
                  <KeyboardArrowLeftIcon />
                </IconButton>
              )}
              {nextDisabled || (
                <IconButton onClick={() => goToPage('next')}>
                  <KeyboardArrowRightIcon />
                </IconButton>
              )}
            </div>
          </div>

          {isCardType ? (
            <div className="rent-main" ref={el => (this.rentMain = el)}>
              {listings.length > 0 ? (
                this.renderListingCards(listings, selectedItem, this.rentMain)
              ) : (
                <h3 className={classes.nolistingstitle}>No Listings Found..</h3>
              )}
            </div>
          ) : (
            <div className="outer-table">
              {listings.length > 0 ? (
                this.renderListingTable(listings)
              ) : (
                <h3 className={classes.nolistingstitle}>No Listings Found..</h3>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ListingsSection;
