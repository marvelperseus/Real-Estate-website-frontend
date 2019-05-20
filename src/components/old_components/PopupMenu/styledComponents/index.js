import styled from 'styled-components';

export const PopupWrapper = styled.div`
  position: absolute;
  left: 5px;
  padding: 10px 15px;
  min-width: 100px;
  background-color: #fff;
  border-radius: 5px;
  color: ${props => props.theme.darkFontColor};
  box-shadow: 2px 0px 24px -6px rgba(0,0,0,0.75);
  cursor: default;
`;
