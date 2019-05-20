import React from 'react';
import { withStyles } from 'material-ui/styles';
import { observer } from 'mobx-react';
import EyeIcon from '@material-ui/icons/RemoveRedEye';
import Tooltip from 'material-ui/Tooltip';
import { Link } from '../../routes';

const styles = theme => ({
  wrapper: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

@observer
class VeiwFormatter extends React.Component {
  render() {
    const { classes, value } = this.props;

    const finalVal = Array.isArray(value)
      ? value.filter(val => val !== '').join(', ') || 'None'
      : value || 'none';

    if (Array.isArray(value) && value.length >= 2) {
      return (
        <Tooltip title={finalVal} enterDelay={400} leaveDelay={100}>
          <div className={classes.wrapper}>{finalVal}</div>
        </Tooltip>
      );
    }

    return <div className={classes.wrapper}>{finalVal}</div>;
  }
}

export default withStyles(styles)(VeiwFormatter);
