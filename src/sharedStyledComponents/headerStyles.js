import styled from 'styled-components';
import { darken, lighten } from 'polished';
import theme from '../themeStyles';

export const HeaderWrapper = styled.header`
  box-sizing: border-box;
  position: fixed;
  display: flex;
  align-items: center;
  top: 0;
  padding: 15px 50px;
  font-weight: 800;
  font-family: Helvetica Neue;
  letter-spacing: 1px;
  z-index: 999;
  height: 60px;
  width: 100%;
  justify-content: flex-end;
  font-size: 14px;
  background-color: ${theme.primaryColor};
  box-shadow: ${props =>
    props.headerBoxShadowOff
      ? 'none'
      : '0px 2px 14px -1px rgba(0, 0, 0, 0.12)'};
  border-bottom: ${props =>
    props.headerBoxShadowOff ? '1px solid rgba(255,255,255,.1)' : 'none'};
`;

export const HeaderLink = styled.a`
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: color 0.1s ease-in-out;
  cursor: pointer;
  padding: 5px 5px;
  &:hover {
    color: #fff;
  }
  &:not(:first-of-type) {
    margin-left: 20px;
  }
`;

export const LeftHeaderLinkWrapper = styled.div`
  display: flex;
  margin-left: auto;
`;

export const MiddleHeaderLinkWrapper = styled.div`
  display: flex;
`;

export const Logo = styled.div`
  margin-right: auto;
  padding-top: 5px;
`;
