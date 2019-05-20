import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';

const styles = theme => ({
  root: {
    position: 'relative',
    height: '200px',
    width: '100%',
    boxShadow: theme.shadows[1],
    borderRadius: '5px',
  },
  boxTop: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50%',
    borderBottom: '1px solid rgba(0,0,0,.15)',
    fontSize: '40px',
    lineHeight: '40px',
    fontWeight: '300',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    padding: '0 10px',
    [theme.breakpoints.down('sm')]: {
      fontSize: '32px',
    },
  },
  boxInfo: {
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: '50%',
    marginTop: '-12px',
    padding: '2px 5px',
    height: '24px',
  },
  boxInfoText: {
    height: '24px',
    display: 'inline-block',
    padding: '4px 10px',
    textTransform: 'uppercase',
    lineHeight: '14px',
    backgroundColor: '#fff',
    border: '1px solid rgba(0,0,0,.15)',
    fontSize: '12px',
    color: '#636c72',
    borderRadius: '10px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    [theme.breakpoints.down('xs')]: {
      fontSize: '10px',
    },
  },
  boxBottom: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    padding: '0 10px',
  },
});

@observer
class StatNumberBox extends Component {
  render() {
    const {
      classes,
      iconClass,
      iconColor,
      statTitle,
      stat,
      widthPercent,
      rootClassName,
      icon: Icon,
    } = this.props;

    return (
      <div
        className={classNames(classes.root, rootClassName)}
        style={{ width: widthPercent ? `${widthPercent}%` : null }}
      >
        <div className={classes.boxTop}>{stat}</div>
        <div className={classes.boxInfo}>
          <span className={classes.boxInfoText}>{statTitle}</span>
        </div>
        <div
          className={classes.boxBottom}
          style={{ color: iconColor || null }}
        >
          {Icon ? <Icon classes={{ root: iconClass }} color="inherit" /> : null}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(StatNumberBox);
