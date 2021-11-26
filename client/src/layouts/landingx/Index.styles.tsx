import { StyledButton as Button } from 'components/form-components/Index.styles';
import styled from 'styled-components';

const StyledInput = styled.input`
  border: 1px solid
    ${(props: { error: boolean }) =>
      props.error ? 'red' : '#c9c9c9'};
  border-right: none;
  border-radius: 6px 0 0 6px;

  &:focus {
    outline: none;
    border: 2px solid
      ${(props: { error: boolean }) =>
        props.error === true
          ? 'red'
          : 'var(--secondary-bg-color, #3484f0)'};
    border-right: none;
  }
  text-indent: 10px;
`;

const StyledDiv = styled.div`
  margin-top: 0.5rem;
`;

const StyledContainer = styled.div`
  --secondary-bg-color: #08a0f7;
  --secondary-color: white;
  margin: 0;

  label {
    font-size: 18px;
  }

  button {
    border: 2px solid transparent;
  }

  button:focus {
    outline: none;
    border: 2px solid var(---primary-bg-color, #3484f0);
    border-left: none;
  }

  & > div {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    /* column-gap: 1rem; */
    margin-left: 5rem;
    margin-top: 2rem;

    --primary-bg-color: #ececec;
    --primary-color: black;
  }
`;

const StyledButton = styled(Button)`
  font-weight: normal;
  height: 3rem;
  padding: 0.5rem;
  background-color: var(--secondary-bg-color, #3484f0);
  color: var(--secondary-color, #fff);
  border-radius: 0 6px 6px 0;
  margin-left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export { StyledDiv, StyledContainer, StyledInput, StyledButton };
