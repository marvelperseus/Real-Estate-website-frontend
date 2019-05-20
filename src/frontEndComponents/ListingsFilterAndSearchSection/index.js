import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import uuid from 'uuid/v4';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';

import { DatePicker } from 'antd';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';

import ListingsSearchBar from '../ListingsSearchBar';
import FineGrainListingFilters from '../FineGrainListingsFilters';
import MainListingFilters from '../MainListingFilters';

import neighborhoods from '../../constants/neighborhoods';

const petPolicySelectItems = [
  {
    value: 'Cats Allowed',
    label: 'Cats Allowed',
  },
  {
    value: 'Dogs Allowed',
    label: 'Dogs Allowed',
  },
  {
    value: 'Cats and Dogs Allowed',
    label: 'Cats and Dogs Allowed',
  },
  {
    value: 'Case by Case',
    label: 'Case by Case',
  },
  {
    value: 'No Pets Allowed',
    label: 'No Pets Allowed',
  },
];

const styles = theme => ({
  root: {
    fontFamily: theme.frontEnd.typography.fontFamily.sansSerif,
    backgroundColor: '#fff',
  },
  topRow: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing.unit,
    width: '100%',
    minWidth: 120,
    color: 'white',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '100%',
    fontSize: '21px',
    color: 'white',
  },
  datePicker: {
    width: '100%',
  },
});

let sqf_query = '';
let price_query = '';
let pets_query = '';
let move_in_date_query = '';
let beds_query = '';
let boroughs_query = '';
let baths_query = '';
let buy_rent_query = '';

@observer
@withStyles(styles)
class ListingsFilterAndSearchSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clearboroughs: false,
      keywords: '',
      minPrice: '',
      maxPrice: '',
      boroughs: [],
      dropDownID: false,
      minSize: '',
      maxSize: '',
      pets: '',
      offer: 'RENT',
      date: null,
      beds: [],
      baths: [],
      'neighborhoods-dropdown': false,
      'price-dropdown': false,
      'size-dropdown': false,
      'more-filters': false,
    };
  }

  componentDidMount() {
    this.makingQuery();
  }

  restOfDropdowns(dropDownID) {
    const dropDowns = [
      'neighborhoods-dropdown',
      'price-dropdown',
      'size-dropdown',
      'more-filters',
    ];

    return dropDowns.filter(dropdown => dropdown !== dropDownID);
  }

  openDropDown = dropDownID => {
    if (this.state[dropDownID]) {
      $('#' + dropDownID)
        .siblings('.dropdown-content')
        .children('.listings-price')
        .slideUp('slow');
      this.setState({ [dropDownID]: false });
    } else {
      $('.listings-price').css('display', 'none');
      $('.dropdown-content').css('display', 'none');
      $('#' + dropDownID)
        .siblings('.dropdown-content')
        .css('display', 'block');
      $('#' + dropDownID).addClass('active');
      $('#' + dropDownID)
        .siblings('.dropdown-content')
        .children('.listings-price')
        .slideDown('slow');
      this.setState({ [dropDownID]: true });
      const restofthem = this.restOfDropdowns(dropDownID);
      console.log(restofthem);
      restofthem.map(dropdown => this.setState({ [dropdown]: false }));
    }
    /*
    if ($('#' + dropDownID).hasClass('active')) {
      boroughs.length > 0 || $('#' + dropDownID).removeClass('active');
      $('#' + dropDownID)
        .siblings('.dropdown-content')
        .children('.listings-price')
        .slideUp('slow');
    } else {
      $('.dropdown a').removeClass('active');
      $('.listings-price').css('display', 'none');
      $('.dropdown-content').css('display', 'none');
      $('#' + dropDownID)
        .siblings('.dropdown-content')
        .css('display', 'block');
      $('#' + dropDownID).addClass('active');
      $('#' + dropDownID)
        .siblings('.dropdown-content')
        .children('.listings-price')
        .slideDown('slow');
    }
    */
  };

  handleSearch = event => {
    event.preventDefault();
    this.makingQuery();
  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleMinPrice = event => {
    this.setState({ minPrice: event.target.value });
  };

  handleMaxPrice = event => {
    this.setState({ maxPrice: event.target.value });
  };

  handleMinSize = event => {
    this.setState({ minSize: event.target.value });
  };

  handleMaxSize = event => {
    this.setState({ maxSize: event.target.value });
  };

  handlePets(pet, button_id) {
    $('.pets_redio button').removeClass('active');
    $('#' + button_id).addClass('active');
    this.setState({ pets: pet });
  }

  makingQuery(dropdownID) {
    if (dropdownID) {
      this.openDropDown(dropdownID);
    }
    let query = '';

    if (this.state.minPrice > 0 && this.state.maxPrice > 0) {
      price_query =
        '{"price":{"$gt":' +
        this.state.minPrice +
        ',"$lt":' +
        this.state.maxPrice +
        '}}';
    } else if (!this.state.minPrice && this.state.maxPrice > 0) {
      price_query = '{"price":{"$lte":' + this.state.maxPrice + '}}';
    } else if (this.state.minPrice && !this.state.maxPrice) {
      price_query = '{"price":{"$gte":' + this.state.minPrice + '}}';
    }

    if (price_query != '') {
      query = price_query;
    }

    if (this.state.keywords !== '') {
      const restofquery = `{"$or": [
          {"borough": { "$regex": "${this.state.keywords}", "$options": "i"}},
          {"amenities": { "$regex": "${this.state.keywords}", "$options": "i"}},
          {"category": { "$regex": "${this.state.keywords}", "$options": "i"}},
          {"ownership": { "$regex": "${this.state.keywords}", "$options": "i"}},
          {"type": { "$regex": "${this.state.keywords}", "$options": "i"}},
          {"petPolicy": { "$regex": "${this.state.keywords}", "$options": "i"}},
          {"neighborhood": { "$regex": "${
            this.state.keywords
          }", "$options": "i"}},
          {"address": { "$regex": "${this.state.keywords}", "$options": "i"}},
          {"description": { "$regex": "${
            this.state.keywords
          }", "$options": "i"}}
        ]
      }`;
      if (query != '') query += `,${restofquery}`;
      else query = restofquery;
    }

    if (this.state.offer === 'RENT') {
      buy_rent_query = '{"offer": "RENT"}';
    } else {
      buy_rent_query = '{"offer": { "$ne": "RENT"}}';
    }

    if (query != '' && buy_rent_query != '') {
      query += ',' + buy_rent_query;
    } else if (buy_rent_query != '') {
      query = buy_rent_query;
    }

    if (this.state.minSize > 0 && this.state.maxSize > 0) {
      sqf_query =
        '{"sqFootage":{"$gt":' +
        this.state.minSize +
        ',"$lt":' +
        this.state.maxSize +
        '}}';
    } else if (!this.state.minSize && this.state.maxSize > 0) {
      sqf_query = '{"sqFootage":{"$lte":' + this.state.maxSize + '}}';
    } else if (this.state.minSize && !this.state.maxSize) {
      sqf_query = '{"sqFootage":{"$gte":' + this.state.minSize + '}}';
    }

    if (query != '' && sqf_query != '') {
      query += ',' + sqf_query;
    } else if (sqf_query != '') {
      query = sqf_query;
    }

    if (this.state.pets != '') {
      pets_query = '{"petPolicy":"' + this.state.pets + '"}';
    }

    if (query != '' && pets_query != '') {
      query += ',' + pets_query;
    } else if (pets_query != '') {
      query = pets_query;
    }

    if (this.state.date) {
      move_in_date_query =
        '{"moveInDate": {"$lte":"' + this.formatDate(this.state.date) + '"}}';
    }

    if (query != '' && move_in_date_query != '') {
      query += ',' + move_in_date_query;
    } else if (move_in_date_query != '') {
      query = move_in_date_query;
    }

    if (this.state.beds.length > 0) {
      beds_query = '{"$or":[' + this.state.beds + ']}';
    } else {
      beds_query = '';
    }

    if (query != '' && beds_query != '') {
      query += ',' + beds_query;
    } else if (beds_query != '') {
      query = beds_query;
    }

    if (this.state.boroughs.length > 0) {
      boroughs_query = '{"$or":[' + this.state.boroughs + ']}';
    } else {
      boroughs_query = '';
    }

    if (query != '' && boroughs_query != '') {
      query += ',' + boroughs_query;
    } else if (boroughs_query != '') {
      query = boroughs_query;
    }

    if (this.state.baths.length > 0) {
      baths_query = '{"$or":[' + this.state.baths + ']}';
    } else {
      baths_query = '';
    }

    if (query != '' && baths_query != '') {
      query += ',' + baths_query;
    } else if (baths_query != '') {
      query = baths_query;
    }

    if (query != '') {
      query = '{ "$and": [ ' + query + '] }';
    } else {
      query = '{}';
    }
    console.log(query);
    this.props.onFilterClick(query);
    this.setState({ dropDownID: '' });
  }

  clearAll = e => {
    this.setState(
      {
        minPrice: '',
        maxPrice: '',
        minSize: '',
        maxSize: '',
        beds: [],
        baths: [],
        openPrice: false,
        keywords: '',
        pets: '',
        date: null,
        boroughs: [],
        clearboroughs: true,
      },
      () => {
        $('.bed-room button').removeClass('active');
        price_query = '';
        sqf_query = '';
        baths_query = '';
        beds_query = '';
        move_in_date_query = '';
        pets_query = '';
        this.makingQuery();
      }
    );
  };

  clearPrice = e => {
    e.preventDefault();
    this.openDropDown('price-dropdown');
    this.setState({ minPrice: '', maxPrice: '', openPrice: false }, () => {
      price_query = '';
      this.makingQuery();
    });
  };

  clearSQF = e => {
    e.preventDefault();
    this.openDropDown('size-dropdown');

    this.setState({ minSize: '', maxSize: '', beds: [], baths: [] }, () => {
      $('.bed-room button').removeClass('active');
      sqf_query = '';
      baths_query = '';
      beds_query = '';
      this.makingQuery();
    });
  };

  clearPets = e => {
    e.preventDefault();
    this.openDropDown('more-filters');
    $('.pets_redio button').removeClass('active');
    this.setState({ pets: '', date: null }, () => {
      move_in_date_query = '';
      pets_query = '';
      this.makingQuery();
    });
  };

  clearBoroughs = e => {
    e.preventDefault();
    console.log('Clear');
    this.openDropDown('neighborhoods-dropdown');
    this.setState({ boroughs: [], clearboroughs: true }, () => {
      this.makingQuery();
      this.setState({ clearboroughs: false });
    });
  };

  onChangeDate = date => this.setState({ date: date });

  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  onChangeBoroughs = borough => event => {
    let boroughs = this.state.boroughs;
    if (event.target.checked) {
      boroughs.push('{"borough":"' + borough + '"}');
    } else {
      boroughs.splice(boroughs.indexOf('{"borough":"' + borough + '"}'), 1);
    }
    this.setState({ boroughs, clearboroughs: false });
  };

  onChangeBeds(bed, id) {
    let beds = this.state.beds;
    $('#' + id).toggleClass('active');
    if ($('#' + id).hasClass('active')) {
      beds.push('{"beds":' + bed + '}');
    } else {
      beds.splice(beds.indexOf('{"beds":' + bed + '}'), 1);
    }

    this.setState({ beds: beds });
  }

  handleBuyRent = event => {
    const { offer } = this.state;
    this.setState({ offer: offer === 'BUY' ? 'RENT' : 'BUY' }, () => {
      this.makingQuery();
    });
  };

  onChangeBaths(bath, id) {
    $('#' + id).toggleClass('active');
    let baths = this.state.baths;
    if ($('#' + id).hasClass('active')) {
      baths.push('{"baths":' + '{"$gte":' + bath + '}}');
    } else {
      baths.splice(baths.indexOf('{"baths":' + '{"$gte":' + bath + '}}'), 1);
    }

    this.setState({ baths: baths });
  }

  render() {
    const {
      boroughs,
      minPrice,
      maxPrice,
      minSize,
      maxSize,
      beds,
      baths,
      pets,
      date,
    } = this.state;
    console.log('pets, date', pets, date);
    const {
      classes,
      onSearchInputChange,
      getInput,
      value,
      onSearchKeyDown,
      onSearchKeyUp,
    } = this.props;
    return (
      <div className="city-top">
        <div className="mobile-menu hidden-md hidden-lg">
          <span>Filter listing</span>
          <i className="fa fa-bars" aria-hidden="true" />
        </div>
        <div className="info-menu">
          <div className="city-search">
            <span>
              <i className="fa fa-map-marker" aria-hidden="true" />
            </span>
            <form onSubmit={this.handleSearch}>
              <input
                type="text"
                value={this.state.keywords}
                onChange={this.handleChange('keywords')}
                placeholder="Search for features, property types, places, and more..."
              />
              <button>
                <i className="fa fa-search" aria-hidden="true" />
              </button>
            </form>
          </div>
          <div className="city-navigation">
            <ul>
              <li>
                <button
                  type="button"
                  onClick={this.handleBuyRent}
                  className="btn btn-toggle"
                  data-toggle="button"
                  aria-pressed="true"
                  autoComplete="off"
                >
                  <div className="handle" />
                </button>
              </li>
              <li className="dropdown">
                <a
                  href="#"
                  className={
                    'dropdown-toggle ' +
                    (this.state['neighborhoods-dropdown'] || boroughs.length > 0
                      ? 'active'
                      : '')
                  }
                  data-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                  onClick={() => this.openDropDown('neighborhoods-dropdown')}
                  id="neighborhoods-dropdown"
                >
                  Neighborhoods{' '}
                  <i className="fa fa-angle-down" aria-hidden="true" />
                </a>
                <div className="dropdown-content size">
                  <div className="listings-price neighborhoods">
                    <ul className="nav nav-tabs tabs-left sideways">
                      <li className="active">
                        <button data-target="#home-v" data-toggle="tab">
                          Bronx
                        </button>
                      </li>
                      <li>
                        <button data-target="#profile-v" data-toggle="tab">
                          Brooklyn
                        </button>
                      </li>
                      <li>
                        <button data-target="#messages-v" data-toggle="tab">
                          Manhattan
                        </button>
                      </li>
                      <li>
                        <button data-target="#settings-v" data-toggle="tab">
                          Queens
                        </button>
                      </li>
                      <li>
                        <button data-target="#staten-v" data-toggle="tab">
                          Staten Island
                        </button>
                      </li>
                    </ul>
                    <div className="tab-content">
                      {neighborhoods.map(neighborhood => {
                        let half_count = Math.round(
                          neighborhood.value.length / 2
                        );
                        const neighborhood1 = neighborhood.value.slice(
                          0,
                          half_count
                        );
                        const neighborhood2 = neighborhood.value.slice(
                          half_count,
                          neighborhood.value.length - 1
                        );
                        const id = neighborhood.id;
                        return (
                          <div
                            key={neighborhood.id}
                            className={
                              neighborhoods[0].id == neighborhood.id
                                ? 'tab-pane active'
                                : 'tab-pane'
                            }
                            id={neighborhood.id}
                          >
                            <div className="col-md-6">
                              {neighborhood1.map((item, index) => (
                                <form key={id + index} className="form-group1">
                                  {this.state.clearboroughs ? (
                                    <input
                                      type="checkbox"
                                      id={id + index}
                                      checked={false}
                                      onChange={this.onChangeBoroughs(
                                        item.value
                                      )}
                                    />
                                  ) : (
                                    <input
                                      type="checkbox"
                                      id={id + index}
                                      onChange={this.onChangeBoroughs(
                                        item.value
                                      )}
                                    />
                                  )}
                                  <label htmlFor={id + index}>
                                    {item.value}
                                  </label>
                                </form>
                              ))}
                            </div>
                            <div className="col-md-6">
                              {neighborhood2.map((item, index) => (
                                <form
                                  key={id + (index + half_count)}
                                  className="form-group1"
                                >
                                  {this.state.clearboroughs ? (
                                    <input
                                      checked={false}
                                      type="checkbox"
                                      id={id + (index + half_count)}
                                      value={item.value}
                                      onChange={this.onChangeBoroughs(
                                        item.value
                                      )}
                                    />
                                  ) : (
                                    <input
                                      type="checkbox"
                                      id={id + (index + half_count)}
                                      value={item.value}
                                      onChange={this.onChangeBoroughs(
                                        item.value
                                      )}
                                    />
                                  )}
                                  <label htmlFor={id + (index + half_count)}>
                                    {item.value}
                                  </label>
                                </form>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="drop-footer">
                      {' '}
                      <button className="clear" onClick={this.clearBoroughs}>
                        Clear
                      </button>{' '}
                      <button
                        onClick={() =>
                          this.makingQuery('neighborhoods-dropdown')
                        }
                        className="apply-cust"
                      >
                        Apply
                      </button>{' '}
                    </div>
                  </div>
                </div>
              </li>
              <li className="dropdown">
                <a
                  href="#"
                  className={
                    'dropdown-toggle ' +
                    (this.state['price-dropdown'] || minPrice + maxPrice !== ''
                      ? 'active'
                      : '')
                  }
                  data-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                  onClick={() => this.openDropDown('price-dropdown')}
                  id="price-dropdown"
                >
                  price <i className="fa fa-angle-down" aria-hidden="true" />
                </a>
                <div className="dropdown-content">
                  <div className="listings-price">
                    <div className="form-row listings-price-row">
                      <div className="form-group form-group-has-addons">
                        <div className="form-control-group">
                          {' '}
                          <button
                            className="button button-outline-light button-active-primary"
                            type="button"
                          >
                            $
                          </button>{' '}
                        </div>
                        <div className="form-control-group">
                          {' '}
                          <label className="form-label">Min.</label>{' '}
                          <input
                            className="form-control"
                            value={this.state.minPrice}
                            onChange={this.handleMinPrice}
                            pattern="\d*"
                            id="listings-min-price-input"
                          />{' '}
                        </div>
                        <div className="form-control-group">
                          {' '}
                          <button
                            className="button button-light button-static"
                            type="button"
                          >
                            to
                          </button>{' '}
                        </div>
                        <div className="form-control-group">
                          {' '}
                          <label className="form-label">Max.</label>{' '}
                          <input
                            className="form-control"
                            value={this.state.maxPrice}
                            onChange={this.handleMaxPrice}
                            pattern="\d*"
                          />{' '}
                        </div>
                      </div>
                    </div>
                    <div className="drop-footer">
                      {' '}
                      <button className="clear" onClick={this.clearPrice}>
                        Clear
                      </button>{' '}
                      <button
                        className="apply-cust"
                        onClick={() => this.makingQuery('price-dropdown')}
                      >
                        Apply
                      </button>{' '}
                    </div>
                  </div>
                </div>
              </li>
              <li className="dropdown">
                <a
                  href="#"
                  className={
                    'dropdown-toggle ' +
                    (this.state['size-dropdown'] ||
                    (maxSize + minSize !== '' || beds.length + baths.length > 0)
                      ? 'active'
                      : '')
                  }
                  data-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                  onClick={() => this.openDropDown('size-dropdown')}
                  id="size-dropdown"
                >
                  SIZE <i className="fa fa-angle-down" aria-hidden="true" />
                </a>
                <div className="dropdown-content" id="size-dropdown">
                  <div className="listings-price">
                    <h3>Bedrooms (Select all that apply)</h3>
                    <div className="bed-room">
                      <div className="checkbox">
                        {' '}
                        <button
                          id="bed1"
                          onClick={() => this.onChangeBeds('1', 'bed1')}
                        >
                          1
                        </button>{' '}
                      </div>
                      <div className="checkbox">
                        {' '}
                        <button
                          id="bed2"
                          onClick={() => this.onChangeBeds('2', 'bed2')}
                        >
                          2
                        </button>
                      </div>
                      <div className="checkbox">
                        {' '}
                        <button
                          id="bed3"
                          onClick={() => this.onChangeBeds('3', 'bed3')}
                        >
                          3
                        </button>
                      </div>
                      <div className="checkbox">
                        {' '}
                        <button
                          id="bed4"
                          onClick={() => this.onChangeBeds('4', 'bed4')}
                        >
                          4+
                        </button>{' '}
                      </div>
                    </div>
                    <h3>Bathrooms (Select all that apply)</h3>
                    <div className="bed-room">
                      <div className="checkbox">
                        {' '}
                        <button
                          onClick={() => this.onChangeBaths(0, 'Bath')}
                          id="Bath"
                        >
                          Any
                        </button>{' '}
                      </div>
                      <div className="checkbox">
                        {' '}
                        <button
                          onClick={() => this.onChangeBaths(1, 'Bath1')}
                          id="Bath1"
                        >
                          1+
                        </button>{' '}
                      </div>
                      <div className="checkbox">
                        {' '}
                        <button
                          onClick={() => this.onChangeBaths(1.5, 'Bath2')}
                          id="Bath2"
                        >
                          1.5+
                        </button>{' '}
                      </div>
                      <div className="checkbox">
                        {' '}
                        <button
                          onClick={() => this.onChangeBaths(2, 'Bath3')}
                          id="Bath3"
                        >
                          2+
                        </button>{' '}
                      </div>
                      <div className="checkbox">
                        {' '}
                        <button
                          onClick={() => this.onChangeBaths(2.5, 'Bath4')}
                          id="Bath4"
                        >
                          2.5+
                        </button>{' '}
                      </div>
                      <div className="checkbox">
                        {' '}
                        <button
                          onClick={() => this.onChangeBaths(3, 'Bath5')}
                          id="Bath5"
                        >
                          3+
                        </button>{' '}
                      </div>
                      <div className="checkbox">
                        {' '}
                        <button
                          onClick={() => this.onChangeBaths(3.5, 'Bath6')}
                          id="Bath6"
                        >
                          3.5+
                        </button>{' '}
                      </div>
                    </div>
                    <h3>SQFT</h3>
                    <div className="form-group form-group-has-addons">
                      <div className="form-control-group">
                        <label className="form-label">Min.</label>
                        <input
                          className="form-control"
                          type="number"
                          value={this.state.minSize}
                          onChange={this.handleMinSize}
                        />
                      </div>
                      <div className="form-control-group">
                        <button
                          className="button button-light button-static"
                          type="button"
                        >
                          to
                        </button>
                      </div>
                      <div className="form-control-group">
                        <label className="form-label">Max.</label>
                        <input
                          className="form-control"
                          type="number"
                          value={this.state.maxSize}
                          onChange={this.handleMaxSize}
                        />
                      </div>
                    </div>
                    <div className="drop-footer">
                      {' '}
                      <button className="clear" onClick={this.clearSQF}>
                        Clear
                      </button>{' '}
                      <button
                        className="apply-cust"
                        onClick={() => this.makingQuery('size-dropdown')}
                      >
                        Apply
                      </button>{' '}
                    </div>
                  </div>
                </div>
              </li>
              <li className="dropdown">
                <a
                  href="#"
                  className={
                    'dropdown-toggle ' +
                    (this.state['more-filters'] || pets !== '' || date != null
                      ? 'active'
                      : '')
                  }
                  role="button"
                  onClick={() => this.openDropDown('more-filters')}
                  id="more-filters"
                >
                  more filters{' '}
                  <i className="fa fa-angle-down" aria-hidden="true" />
                </a>
                <div className="dropdown-content">
                  <div className="listings-price">
                    <div className="col-md-12">
                      <h3>Pets</h3>
                      <div className="outline">
                        <div className="pets_redio">
                          <button
                            id="cats"
                            onClick={() =>
                              this.handlePets('Cats Allowed', 'cats')
                            }
                          >
                            Cats Allowed
                          </button>
                        </div>
                        <div className="pets_redio">
                          <button
                            id="dogs"
                            onClick={() =>
                              this.handlePets('Dogs Allowed', 'dogs')
                            }
                          >
                            Dogs Allowed
                          </button>
                        </div>
                        <div className="pets_redio">
                          <button
                            id="cats_dogs"
                            onClick={() =>
                              this.handlePets(
                                'Cats and Dogs Allowed',
                                'cats_dogs'
                              )
                            }
                          >
                            Cats and Dogs Allowed
                          </button>
                        </div>
                        <div className="pets_redio">
                          <button
                            id="case"
                            onClick={() =>
                              this.handlePets('Case by Case', 'case')
                            }
                          >
                            Case by Case
                          </button>
                        </div>
                        <div className="pets_redio">
                          <button
                            id="nopets"
                            onClick={() =>
                              this.handlePets('No Pets Allowed', 'nopets')
                            }
                          >
                            No Pets Allowed
                          </button>
                        </div>
                      </div>
                      <h3>Available On or Before</h3>
                      <div
                        className="form-control-group"
                        style={{ width: '77%' }}
                      >
                        <DatePicker
                          className={classes.datePicker}
                          onChange={this.onChangeDate}
                          value={this.state.date}
                          type="text"
                          placeholder="Move in Date"
                        />
                      </div>
                      <div className="drop-footer">
                        <button className="clear" onClick={this.clearPets}>
                          Clear
                        </button>
                        <button
                          className="apply-cust"
                          onClick={() => this.makingQuery('more-filters')}
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
              <li className="dropdown">
                <a aria-hidden="true" onClick={this.clearAll}>
                  Reset
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default ListingsFilterAndSearchSection;
