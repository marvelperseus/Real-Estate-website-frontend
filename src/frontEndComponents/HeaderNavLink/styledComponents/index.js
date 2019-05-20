import styled from 'styled-components';

export const HeaderLink = styled.a`
  box-sizing: border-box;
  position: relative;
  color: ${props =>
    props.active ? 'rgba(255,255,255,1);' : 'rgba(255,255,255,.9)'};
  text-decoration: none;
  transition: color 0.1s ease-in-out;
  cursor: pointer;
  padding: 5px 5px;
  &:after {
    margin-top: 6px;
    background: ${props => props.theme.accentColor};
    max-width: ${props => (props.active ? '100%' : '0px')};
    right: ${props => (props.active ? '10px' : '0')};
    bottom: 0;
    content: '  ';
    display: block;
    height: 2px;
    left: 10px;
    position: absolute;
    z-index: 5;
    transition: max-width 0.2s ease-in-out;
  }
  &:hover {
    color: #fff;
    &:after {
      right: 10px;
      max-width: 100%;
    }
  }
  &:not(:first-of-type) {
    margin-left: 20px;
  }
`;

export const NavItem = styled.button`
  box-sizing: border-box;
  position: relative;
  color: ${props =>
    props.active ? 'rgba(255,255,255,1);' : 'rgba(255,255,255,.9)'};
  text-decoration: none;
  transition: color 0.1s ease-in-out;
  cursor: pointer;
  padding: 5px 5px;
  font-weight: 800;
  font-size: 14px;
  background: transparent;
  border: none;
  outline: none;
  &:after {
    margin-top: 6px;
    background: ${props => props.theme.accentColor};
    max-width: ${props => (props.active ? '100%' : '0px')};
    right: ${props => (props.active ? '10px' : '0')};
    bottom: 0;
    content: '  ';
    display: block;
    height: 2px;
    left: 10px;
    position: absolute;
    z-index: 5;
    transition: max-width 0.2s ease-in-out;
  }
  &:hover {
    color: #fff;
    &:after {
      right: 10px;
      max-width: 100%;
    }
  }
  &:not(:first-of-type) {
    margin-left: 20px;
  }
`;
