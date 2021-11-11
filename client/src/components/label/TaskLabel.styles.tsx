import styled from 'styled-components';

export const CreateEditLabelButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 5rem;
  border: 1px solid #dfe1e6;
  border-radius: 0.25rem;
  outline: none;
  padding: 0.5rem;
  cursor: pointer;
  color: ${(props) => (props.type === 'cancel' ? '#000' : '#fff')};
  background: ${(props) =>
    props.type === 'cancel' ? '#f1f1f1' : '#34B3E9'};
`;

export const CreateEditLabelButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 0.5rem;
  margin-top: 1rem;
`;

export const CreateEditLabelInput = styled.input`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.5rem;
  width: 100%;
  outline: none;
  margin-bottom: 1rem;
  font-size: 1rem;

  &:focus,
  &:hover {
    border-color: #aaa;
  }
`;

export const CreateEditLabelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.25rem;
  font-size: 1rem;
`;

export const CreateEditLabelContainer = styled.div`
  display: flex;
  flex-direction: column;

  span {
    width: max-content;
  }
`;

export const CreateLabelButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 70%;
  padding: 0.5rem;
  background: #08a0f7;
  color: white;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    border-color: #cfcfcf;
  }
`;

export const CancelLabelButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30%;
  padding: 0.5rem;
  margin-left: 0.5rem;
  background: #f1f1f1;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid transparent;

  &:hover {
    border-color: #cfcfcf;
  }
`;

export const HiddenCheckbox = styled.input.attrs({
  type: 'checkbox',
})`
  position: absolute;
  left: -100vw;
`;

export const Label = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem;
  position: relative;
  text-transform: capitalize;
  background: ${(props) => `${props.color}`};
  margin: 0.25rem 0;
  border-radius: 4px;

  label {
    cursor: pointer;
    min-width: 10rem;
  }

  ${HiddenCheckbox}:checked + label {
    &:after {
      content: '✓';
      margin-left: 0.5rem;
    }
  }
`;

export const LabelContainer = styled.div`
  gap: 0.35rem;

  span {
    border: 1px solid transparent;
    cursor: pointer;
    padding: 0.25rem;

    &:hover {
      border: 1px solid #ddd;
      border-radius: 4px;
    }
  }
`;

export const AllLabelContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 0.5rem;
`;

export const StyledSearchInput = styled.input`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 0.25rem;
  width: 100%;
  margin-bottom: 0.5rem;
  outline: none;

  &:focus,
  &:hover {
    border-color: #aaa;
  }
`;

export const LabelPopoverHeader = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #b1b1b1;
  margin-bottom: 0.75rem;
  padding-bottom: 0.25rem;
`;

export const LabelPopoverContainer = styled.div`
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const AddLabelButton = styled.div`
  width: 100%;
  min-width: 11rem;
  padding: 0.4rem;
  margin: 0.5rem 0;
  border-radius: 0.25rem;
  border: 1px solid #b1b1b1;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

export const LabelHeader = styled.h1`
  font-size: 0.875rem;
`;

export const TaskLabelContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  div {
    width: 50%;
  }
`;
