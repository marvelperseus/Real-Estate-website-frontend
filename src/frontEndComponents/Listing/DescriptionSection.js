import React from 'react';
import { observer } from 'mobx-react';
import { withStyles } from 'material-ui/styles';
import classnames from 'classnames';

const styles = theme => ({
  root: {
    height: 562,
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
    padding: '10px 25px 25px 25px',
    fontFamily: theme.frontEnd.typography.fontFamily.sansSerif2,
    color: 'rgba(0,0,0,.8)',
    border: '1px solid rgba(0,0,0,.1)',
    backgroundColor: '#fff',
    '&::after': {
      content: "''",
      position: 'absolute',
      zIndex: 1,
      bottom: 25,
      left: 0,
      pointerEvents: 'none',
      backgroundImage:
        'linear-gradient(to bottom, rgba(255,255,255, 0), rgba(255,255,255, 1) 90%)',
      width: '100%',
      height: '4em',
    },
  },
  descriptionTitle: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '20px',
    height: '50px',
    fontSize: '1.5rem',
    fontWeight: '600',
  },
  description: {
    lineHeight: '1.6rem',
    overflow: 'auto',
  },
  buffer: {
    height: '45px',
    width: '100%',
    pointerEvents: 'none',
  },
});

@withStyles(styles)
@observer
class DescriptionSection extends React.Component {
  render() {
    const { classes, description } = this.props;

    return (
      <div className={classes.root}>
        <div className={classes.descriptionTitle}>Description</div>
        <div className={classes.description}>
          {description}
          <div className={classes.buffer} />
        </div>
      </div>
    );
  }
}

export default DescriptionSection;
