import styled from 'styled-components';
import { darken } from 'polished';

export default styled.a`
  display: block;
  text-decoration: none;
  color: ${props => props.fontColor || props.light ? props.theme.lightFontColor : props.theme.darkFontColor};
  font-size: ${props => props.fontSize || 'inherit'};
  font-family: ${props => props.theme.sansSerifFont};
  cursor: pointer;
  transition: color .2s ease-in-out;
  &:hover {
    color: ${props => props.hoverFontColor || props.light ? darken(0.3, props.theme.lightFontColor) : darken(0.3, props.theme.darkFontColor)};
  }
`;
