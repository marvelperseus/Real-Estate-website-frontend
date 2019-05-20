import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import ArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import Select from 'react-select';
import { lighten } from 'polished';

const styles = theme => ({
  root: {
    display: 'flex',
    height: '56px',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '0.9rem',
    color: 'rgba(0,0,0,.8)',
    backgroundColor: '#fff',
  },
  expandArrowWrapper: {
    display: 'flex',
    alignItems: 'center',
    marginLeft: '15px',
  },
  expandArrow: {
    fontSize: '1.1rem',
  },
  selectWrapper: {
    marginRight: '20px',
  },
});

const listingTypes = [
  { value: 'residentialRentals', label: 'Residential Rentals' },
  { value: 'residentialSales', label: 'Residential Sales' },
  { value: 'commercialRentals', label: 'Commercial Rentals' },
  { value: 'commercialSales', label: 'Commercial Sales' },
];

const regions = [
  { value: 'newYork', label: 'New York' },
];

const areas = [
  { value: 'manhattan', label: 'Manhattan' },
];

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
    backgroundColor: 'inherit',
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      cursor: isDisabled ? 'not-allowed' : 'pointer',
      borderRadius: '4px',
    };
  },
};

@observer
@withStyles(styles)
class FineGrainListingsFilters extends Component {
  render() {
    const { classes, setListingType, setRegion, setArea } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.selectWrapper}>
          <Select
            styles={selectStyles}
            options={listingTypes}
            placeholder="Select a listing type..."
            blurInputOnSelect
            isSearchable={false}
            onInputChange={setListingType}
          />
        </div>
        <div className={classes.selectWrapper}>
          <Select
            styles={selectStyles}
            options={regions}
            defaultValue={[regions[0]]}
            placeholder="Select a region..."
            blurInputOnSelect
            onInputChange={setRegion}
          />
        </div>
        <div>
          <Select
            styles={selectStyles}
            options={areas}
            placeholder="Select an area..."
            blurInputOnSelect
            isClearable
            onInputChange={setArea}
          />
        </div>
      </div>
    );
  }
}

export default FineGrainListingsFilters;
