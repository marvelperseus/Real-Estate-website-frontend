import React from 'react';
import { withStyles } from 'material-ui/styles';
import { Typography } from 'material-ui';

const styles = theme => ({
  wrapper: {
    display: 'table',
    position: 'relative',
    cursor: 'pointer',
    padding: '15px 20px',
    border: 'none',
    borderRadius: '10px',
    width: '190px',
    height: '180px',
    boxShadow: theme.shadows[4],
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,.1)',
    },
  },
  contentWrapper: {
    display: 'table-cell',
    verticalAlign: 'middle',
  },
  textWrapper: {
    textAlign: 'center',
  },
  icon: {
    margin: 'auto',
    marginBottom: '5px',
    display: 'block',
    fontSize: '60px',
  },
});


const LargeIconTextBtn = props => {
  const {
    title,
    description,
    icon: Icon,
    fontSize,
    classes,
    alignCenter,
    onClick,
    iconColor,
  } = props;

  return (
    <button
      className={classes.wrapper}
      style={{ margin: alignCenter ? 'auto' : null }}
      onClick={onClick}
    >
      <div className={classes.contentWrapper}>
        <div style={{ color: iconColor }}>
          <Icon classes={{ root: classes.icon }} />
        </div>
        <Typography align="center" className={classes.textWrapper} variant="body2" style={{ fontSize }}>
          {title}
        </Typography>
        <Typography align="center" variant="caption">{description}</Typography>
      </div>
    </button>
  );
};

export default withStyles(styles)(LargeIconTextBtn);
