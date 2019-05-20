import styled from 'styled-components';
import { darken } from 'polished';

export default styled.a`
  width: 150px;
  padding: 10px 15px;
  text-decoration: none;
  color: ${props => props.theme.lightFontColor};
  font-size: 18px;
  text-align: center;
  background-color: ${props => darken(0.05, props.theme.primaryColor)};
`;
