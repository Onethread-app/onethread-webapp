import styled from 'styled-components';

const StyledButton = styled.button`
  background: var(--primary-bg-color, #34b3e9);
  width: fit-content;
  padding: 1rem;
  color: var(--primary-color, #fff);
  border-radius: 6px;
  border-width: 2px;
  border-color: transparent;
  cursor: pointer;
  transition: all 500ms ease-in-out;
  font-weight: bold;
  &:hover {
    color: var(--primary-bg-color, #34b3e9);
    background-color: var(--primary-color, #fff);
    border-color: var(--primary-bg-color, #34b3e9);
  }
  &::disabled {
    color: var(--dark-color, black);
    background-color: var(--disabled-bg-color, gray);
    border-color: var(--disabled-bg-color, gray);
    cursor: not-allowed;
  }
`;

export default StyledButton;
