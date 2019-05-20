import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';
import { observer } from 'mobx-react';
import Portal from 'material-ui/Portal';
import { PropagateLoader } from 'react-spinners';

const Loader = PropagateLoader;

const styles = theme => ({
  root: {
    position: 'fixed',
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.palette.secondary.dark,
    color: '#fff',
    zIndex: 9999999,
  },
  text: {
    fontFamily: theme.typography.fontFamily,
    fontSize: '1.1rem',
    marginBottom: theme.spacing.unit * 3,
  },
  contentContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

@observer
class FullScreenLoader extends Component {
  render() {
    const { open, classes, text } = this.props;
    return (
      <Portal>
        <div className={classes.root} style={{ display: open ? 'flex' : 'none' }}>
          <div className={classes.contentContainer}>
            {text ? <div className={classes.text}>{text}</div> : null}
            <Loader
              color="#fff"
              loading
            />
          </div>
        </div>
      </Portal>
    );
  }
}

export default withStyles(styles)(FullScreenLoader);
