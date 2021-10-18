import styled from 'styled-components';

export const SelectItem = styled.div`
  text-transform: capitalize;

  label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

export const BackButton = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 12px;
  border: 1px solid #ccc;
  width: min-content;
  padding-right: 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
`;

export const PanelTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 100px;
  cursor: pointer;
  color: ${(props) =>
    props.active ? 'rgb(8, 160, 247)' : 'inherit'};

  p {
    margin: 0;
  }
`;

export const PanelViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 100px;
`;

export const PanelsTitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PanelsContainer = styled.div`
  padding: 0.5rem;
`;
