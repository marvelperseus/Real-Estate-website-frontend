import styled from 'styled-components';

export const SideNavHeaderWrapper = styled.div`
  display: table;
  min-width: 100%;
  height: 80px;
  border: none;
  text-align: center;
`;

export const SideNavHeaderTitle = styled.div`
  vertical-align: middle;
  display: table-cell;
  min-width: 100%;
  font-family: Roboto;
  font-size: 24px;
  text-align: center;
`;

export const SideNavHeaderSubtitle = styled.div`
  min-width: 100%;
  font-family: Roboto;
  font-size: 12px;
  text-align: center;
  color: ${props => props.theme.accentColor}
`;

export const AccentSpan = styled.span`
  color: ${props => props.theme.accentColor}
`;
