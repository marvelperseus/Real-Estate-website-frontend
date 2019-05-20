import styled from 'styled-components';

export default styled.div`
  position: relative;
  background-color: ${props => props.theme.primaryColor};
  min-width: 280px;
  max-width: 280px;
  color: ${props => props.theme.lightFontColor};
`;
