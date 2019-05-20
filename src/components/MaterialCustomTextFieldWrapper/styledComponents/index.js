import styled from 'styled-components';

export const Input = styled.input`
  box-sizing: border-box;
  display: block;
  width: 100%;
  padding: 10px 15px;
  font-size: 16px;
  font-weight: 400;
  font-family: Helvetica Neue;
  border: 1px solid #ddd;
  border-radius: 5px;
`;

export const InputWrapper = styled.div`
  margin-bottom: 30px;
`;

export const FormMessage = styled.small`
  color: ${props => props.color};
`;
