import styled from 'styled-components';
import { darken, lighten } from 'polished';

export const SideNavLinkItemWrapper = styled.div`
  height: 45px;
  min-width: 100%;
  font-size: 16px;
  font-family: Roboto;
  font-weight: 500;
  color: ${props => (props.isAdminLinks ? '#fff' : 'inherit')};
  cursor: pointer;
  background-color: ${props =>
    props.active ? 'rgba(255, 255, 255, 0.15) !important' : 'initial'};
  transition: color .3s ease-in-out;
  &:hover {
    background-color: ${props =>
      props.isAdminLinks ? 'rgba(0, 0, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)'};
  }
}
`;

export const SideNavLinkItemAnchor = styled.a`
  display: flex !important;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  padding-right: 15px;
  padding-left: 55px;
  vertical-align: middle;
  display: table-cell;
  min-width: 100%;
  text-decoration: none;
  color: #fff;
  &:hover {
    color: #fff !important;
  }
`;

export const SideNavLinkItemDiv = styled.div`
  display: flex !important;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  padding-right: 15px;
  padding-left: 55px;
  vertical-align: middle;
  display: table-cell;
  min-width: 100%;
  text-decoration: none;
`;

export const IconWrapper = styled.span`
  margin-right: 35px;
  position: absolute;
  left: ${props => (props.iconLeft ? props.iconLeft : '15px')};
  @media screen and (max-width: 600px) {
    left: ${props => (props.iconLeftSmall ? props.iconLeftSmall : '8px')};
  }
`;
