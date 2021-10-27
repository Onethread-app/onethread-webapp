import styled from 'styled-components';

export const ViewOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.15rem 0.25rem;
  border-radius: 0.25rem;
  background: ${(props) => (props.selected ? '#d4d4d4' : 'inherit')};
  text-transform: capitalize;
  cursor: pointer;
`;

export const ViewSelectorContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 18px;
  gap: 0.25rem;

  label {
    padding: 0.15rem 0.25rem;
    margin-right: 0.35rem;
  }
`;
