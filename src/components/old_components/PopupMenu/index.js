import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Link } from '../../routes';
import { PopupWrapper } from './styledComponents';
import AnchorTag from '../../sharedStyledComponents/AnchorTag';

@observer
class PopupMenu extends Component {
  render() {
    return (
      <PopupWrapper>
        <Link route="home"><AnchorTag>Home</AnchorTag></Link>
        <AnchorTag onClick={this.props.onLogout}>Log Out</AnchorTag>
      </PopupWrapper>
    );
  }
}

export default PopupMenu;
