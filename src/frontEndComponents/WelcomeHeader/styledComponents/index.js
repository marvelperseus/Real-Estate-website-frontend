import styled from 'styled-components';

export const JumbotronWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
`;

export const JumbotronImg = styled.img`
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0; 
  z-index: -2;
  height: calc(100vh - 60px);
  width: 100%;
  display: block;
  object-fit: cover;
`;

export const JumbotronImgOverlay = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  top: 0; 
  z-index: -1;
  background-color: rgba(74,74,74,.68);
`;

