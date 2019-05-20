import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  form: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: '100%',
    fontSize: '0.8rem',
    paddingLeft: '50px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  inputWrapper: {
    width: '100%',
    height: '56px',
  },
});

@observer
@withStyles(styles)
class ListingsSearchBar extends Component {
  render() {
    const { classes, onChange, value, getInput, onKeyDown, onKeyUp } = this.props;
    return (
      <div className={classes.inputWrapper}>
        <input
          className={classes.input}
          ref={input => typeof getInput === 'function' ? getInput(input) : null}
          id="listings-search-bar"
          type="text"
          placeholder="Search neighborhood"
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
        />
      </div>
    );
  }
}

export default ListingsSearchBar;
