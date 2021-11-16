import styled from 'styled-components';

export const StyledTimer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #5a5a5a;
  border: ${(props) =>
    !!props.list ? 'none' : ' 1px solid #b1b1b1'};
  border-radius: 0.25rem;
  margin-bottom: 0.5rem;
  width: 120px;
  height: 35px;
`;

export const StyledWatch = styled.div`
  margin-left: 0.5rem;
`;

export const StopButton = styled.div`
  border: 1px solid #ffffff;
  box-sizing: border-box;
  border-radius: 4px;
  height: 24px;
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.25rem;
  margin-top: 4px;
  margin-bottom: 4px;
  margin-right: 0.5rem;
  margin-left: 0.5rem;
  cursor: pointer;
`;
