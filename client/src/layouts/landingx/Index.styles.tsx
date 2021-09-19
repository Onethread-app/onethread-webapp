import { StyledButton as Button } from 'components/form-components/Index.styles';
import styled from 'styled-components';

const StyledInput = styled.input`
  border: 2px solid
    ${(props: { error: boolean }) =>
      props.error === true ? 'red' : 'transparent'};

  &:focus {
    outline: none;
    border: 2px solid
      ${(props: { error: boolean }) =>
        props.error === true
          ? 'red'
          : 'var(--primary-bg-color, #3484f0)'};
  }
  text-indent: 10px;
`;

const StyledDiv = styled.div`
  margin-top: 0.5rem;
`;

const StyledContainer = styled.div`
  margin: 0;

  label {
    font-size: 18px;
  }

  input,
  button {
    border: 2px solid transparent;
  }

  input:focus,
  button:focus {
    outline: none;
    border: 2px solid var(---primary-bg-color, #3484f0);
  }

  & > div {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    column-gap: 1rem;
    margin-left: 5rem;
    margin-top: 2rem;

    --primary-bg-color: #ececec;
    --primary-color: black;
  }
`;

const StyledButton = styled(Button)`
  font-weight: normal;
  width: 90px;
  height: 3rem;
  padding: 0;
`;

export { StyledDiv, StyledContainer, StyledInput, StyledButton };
