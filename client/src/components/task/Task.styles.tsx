import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem;
`;

export const Button = styled.button`
  border: 1px solid #b1b1b1;
  box-sizing: border-box;
  border-radius: 4px;
  font-family: Poppins;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  padding: 7px 14px;
  cursor: pointer;
  margin-right: 13px;
  background-color: ${({ type }) =>
    type === 'success'
      ? '#4caf50'
      : type === 'danger'
      ? '#f44336'
      : '#fff'};
  color: ${({ type }) => (type ? '#fff' : '#000')};
`;
