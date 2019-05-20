import styled from 'styled-components';
import { darken } from 'polished';

export default styled.button`
  margin-right: 20px;
  padding: 10px 20px;
  width: ${props => props.width ? props.width + '%' : 'auto'};
  font-size: 20px;
  font-weight: 400;
  font-family: Helvetica Neue;
  background-color: transparent;
  border: none;
  background-color: ${props => props.theme.secondaryColor};
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  outline: none;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  &:hover {
    color: #fff;
    background-color: ${props => darken(0.1, props.theme.secondaryColor)};
  }
`;
