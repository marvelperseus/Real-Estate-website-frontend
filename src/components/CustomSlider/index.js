import React, { Component } from 'react';
import { observer } from 'mobx-react';
import uuid from 'uuid/v4';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    appearance: 'none',
    width: '50%',
    height: '3px',
    background: '#d3d3d3',
    outline: 'none',
    opacity: '0.7',
    transition: 'opacity .2s',
    borderRadius: '50px',
    cursor: 'grab',
    '&:hover': {
      opacity: '1',
    },
  },
  label: {
    marginRight: '15px',
    fontFamily: theme.typography.fontFamily,
  },
});

@observer
class CustomSlider extends Component {
  constructor(props) {
    super(props);
    this._id = uuid();
  }
  renderRabelComponent = () => {
    const { id, label, labelClassName, classes } = this.props;
    return (
      <label className={classNames(labelClassName || classes.label)} htmlFor={id || this._id}>{label}</label>
    );
  }

  render() {
    const {
      value,
      min,
      max,
      inputClassName,
      rootClassName,
      id, onChange,
      label,
      classes,
    } = this.props;
    const actualMin = typeof min === 'number' ? min : 0;
    const actualMax = typeof max === 'number' ? max : 100;
    const actualValue = typeof value === 'number' ? value : actualMin;
    return (
      <div className={classNames(rootClassName || classes.root)}>
        {label ? this.renderRabelComponent() : null}
        <input
          type="range"
          min={actualMin}
          max={actualMax}
          value={actualValue}
          className={classNames(inputClassName || classes.input)}
          id={id || this._id}
          onChange={event => typeof onChange === 'function' && onChange(event.target.value)}
        />
      </div>
    );
  }
}

export default withStyles(styles)(CustomSlider);
