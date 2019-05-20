import React from 'react';
import { withStyles } from 'material-ui/styles';
import { observer } from 'mobx-react';
import EyeIcon from '@material-ui/icons/RemoveRedEye';
import Tooltip from 'material-ui/Tooltip';
import { Link } from '../../routes';

const styles = theme => ({
  wrapper: {
    width: '90%',
    height: '90%',
    boxSizing: 'border-box',
    textAlign: 'center',
    color: '#00C853',
    cursor: 'pointer',
  },
});

@observer
class VeiwFormatter extends React.Component {
  render() {
    const { classes } = this.props;
    let id;
    let route;
    let onClick;
    let type;
    let noShow;
    let needsEvent;

    if (this.props && this.props.value) {
      id = this.props.value.id;
      route = this.props.value.route;
      onClick = this.props.value.onClick;
      type = this.props.value.type;
      noShow = this.props.value.noShow;
      needsEvent = this.props.value.needsEvent;
    }

    if (noShow) return <div />;

    if (type === 'action' && onClick) {
      return (
        <Tooltip title="Click to view" enterDelay={400} leaveDelay={100}>
          <div className={classes.wrapper} id="viewTableIcon">
            <EyeIcon
              onClick={event => {
                if (needsEvent) {
                  onClick(event);
                } else {
                  onClick();
                }
                if (event.stopPropagation) event.stopPropagation();
              }}
            />
          </div>
        </Tooltip>
      );
    }

    return (
      <Tooltip title="Click to view" enterDelay={400} leaveDelay={100}>
        <Link route={route} params={{ id }}>
          <a>
            <div className={classes.wrapper}>
              <EyeIcon />
            </div>
          </a>
        </Link>
      </Tooltip>
    );
  }
}

export default withStyles(styles)(VeiwFormatter);
