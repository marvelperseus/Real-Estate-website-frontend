import React, { Component } from 'react';
import { observer } from 'mobx-react';
import ListingsFilterAndSearchSection from '../frontEndComponents/ListingsFilterAndSearchSection';

@observer
class ListingsFilterAndSearchSectionContainer extends Component {
  constructor(props) {
    super(props);

    this.isFreshReturnKeyPress = true;

    this.state = {
      value: '',
    };
  }

  onSubmit = event => {
    const { onSubmit } = this.props;
    const value = this.state.value.trim();

    if (event.preventDefault) event.preventDefault();

    if (!value) return;

    if (onSubmit) onSubmit(value);
  }

  onSearchInputChange = event => {
    const { value } = event.target;
    console.log(value);

    this.setState({ value });
  }

  onSearchKeyDown = event => {
    const key = event.key || event.keyCode;

    if (!this.isFreshReturnKeyPress) return;

    if (key === 'Enter' || key === 13) {
      this.onSubmit(event);
      this.isFreshReturnKeyPress = false;
    }
  }

  onSearchKeyUp = () => {
    if (this.isFreshReturnKeyPress === false) {
      this.isFreshReturnKeyPress = true;
    }
  }

  getInput = input => {
    this._input = input;
  }

  clearInput = () => {
    this._input.value = '';
  }

  render() {
    const { onSearchInputChange, getInput, onSearchKeyDown, onSearchKeyUp } = this;
    const { onSubmit } = this.props;
    const { value } = this.state;
    return (
      <div>
        <ListingsFilterAndSearchSection
          value={value}
          onSearchInputChange={onSearchInputChange}
          getInput={getInput}
          onSearchKeyDown={onSearchKeyDown}
          onSearchKeyUp={onSearchKeyUp}
          onFilterClick={onSubmit}
        />
      </div>
    );
  }
}

export default ListingsFilterAndSearchSectionContainer;
