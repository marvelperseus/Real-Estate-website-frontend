import { withRouter } from 'next/router';
import React, { Children } from 'react';
import { Link } from '../../routes';

const ActiveLink = ({ router, children, ...props }) => {
  const child = Children.only(children);
  let active;

  if (router.pathname === props.href) {
    active = true;
  } else {
    active = false;
  }

  return <Link {...props}>{React.cloneElement(child, { active })}</Link>;
};

export default withRouter(ActiveLink);
