import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  display: ${props => props.isApp ? 'flex' : 'relative'};
`;

export const HeaderAndAppContentWrapper = styled.div`
  width: 100%;
  height: 100%;
`;
