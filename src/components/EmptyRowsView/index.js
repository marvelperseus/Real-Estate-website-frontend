import React from 'react';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  root: {
    textAlign: 'center',
    marginTop: '10px',
  },
});

const EmptyRowsView = ({ classes, text }) => (
  <Typography className={classes.root} variant="headline">{text || 'No data available.'}</Typography>
);

export default withStyles(styles)(EmptyRowsView);
