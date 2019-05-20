import React from 'react';
import { withStyles } from 'material-ui/styles';
import { observer } from 'mobx-react';

const styles = theme => ({
  wrapper: {
    width: '90%',
    height: '90%',
    boxSizing: 'border-box',
  },
  emailLink: {
    textDecoration: 'none',
    color: '#3D81BF',
  },
});

@observer
class PhoneNumberFormatter extends React.Component {
  render() {
    const email = this.props.value;
    const { classes } = this.props;

    return (

      <div className={classes.wrapper}>
        <a href={`mailto:${email}`} className={classes.emailLink}>{email}</a>
      </div>
    );
  }
}

export default withStyles(styles)(PhoneNumberFormatter);
