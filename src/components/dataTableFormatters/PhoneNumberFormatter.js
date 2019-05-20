import React from 'react';
import { withStyles } from 'material-ui/styles';
import { observer } from 'mobx-react';
import MobileDetect from 'mobile-detect';

const styles = theme => ({
  wrapper: {
    width: '90%',
    height: '90%',
    boxSizing: 'border-box',
  },
  phoneNumberLink: {
    textDecoration: 'none',
    color: '#3D81BF',
  },
});

let md;
if (typeof window !== 'undefined') {
  md = new MobileDetect(window.navigator.userAgent);
}

@observer
class PhoneNumberFormatter extends React.Component {
  renderAnchorTag = phoneNumber => {
    const { classes } = this.props;
    if (md && md.mobile()) {
      return <a href={`tel:${phoneNumber}`} className={classes.phoneNumberLink}>{phoneNumber}</a>
    }
    return <span>{phoneNumber}</span>;
  }
  render() {
    const phoneNumber = this.props.value;
    const { classes } = this.props;

    return (

      <div className={classes.wrapper}>
        {this.renderAnchorTag(phoneNumber)}
      </div>
    );
  }
}

export default withStyles(styles)(PhoneNumberFormatter);
