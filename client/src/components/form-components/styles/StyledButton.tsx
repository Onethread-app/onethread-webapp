import styled from 'styled-components';

const StyledButton = styled.button`
  background: var(--secondary-bg-color, #08a0f7);
  width: fit-content;
  padding: 1rem;
  color: var(--secondary-color, #fff);
  border-radius: 6px;
  border-width: 2px;
  border-color: transparent;
  cursor: pointer;
  transition: all 500ms ease-in-out;
  font-weight: bold;

  &::disabled {
    color: var(--disabled-color, black);
    background-color: var(--disabled-bg-color, gray);
    border-color: var(--disabled-bg-color, gray);
    cursor: not-allowed;
  }
`;

export default StyledButton;
