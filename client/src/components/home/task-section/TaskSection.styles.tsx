import { StyledTextInput } from 'components/form-components/Index.styles';
import styled from 'styled-components';

const SuccessToaster = styled.div`
  padding: 2rem;
  border: none;
  border-left: 3px solid #00a150;
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  z-index: 10000;
`;

const ErrorToaster = styled.div`
  padding: 2rem;
  border: none;
  border-left: 3px solid red;
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  z-index: 10000;
`;

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px 7px;
  height: 33px;
  left: 43px;
  top: 295px;
  white-space: nowrap;
  background: #08a0f7;
  border-radius: 4px;
  color: #fff;
  border: none;

  &:disabled {
    background: rgba(8, 160, 247, 0.6);
  }
`;

const Header = styled.header`
  font-weight: 500;
  font-size: 18px;
  line-height: 27px;
  color: var(--dark-color, #323030);
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
  transform: rotate(0.13deg);
  display: flex;
  justify-content: space-between;
  align-items: center;

  img {
    margin-right: 12px;
    cursor: pointer;
  }
`;

const TextInput = styled(StyledTextInput)`
  height: 36px;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 350px;
  border: ${({ hasError }) => (hasError ? '1px solid red' : 'none')};
  vertical-align: middle;
  font-size: 24px;
  font-weight: bold;
  margin-top: 4px;
  text-indent: 0px;
  background-color: #fff;

  &:focus {
    outline: none;
    font-weight: bolder;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: ${({ justify }) => justify ?? 'center'};
  align-items: center;
  width: 100%;
  padding: 1rem 0;
  column-gap: 4px;

  & > label {
    width: 20%;
  }

  input[type='date'],
  select {
    min-width: 167px;
    height: 30px;
    border: 1px solid #b1b1b1;
    box-sizing: border-box;
    border-radius: 4px;
  }

  textarea {
    padding: 0.5rem;
    width: 70%;
    max-width: 526px;
    height: 138px;
    background: #ffffff;
    border: 1px solid #e2e2e2;
    box-sizing: border-box;
    box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }

  div {
    display: flex;
    column-gap: 0.5rem;
  }
`;

const SimpleButton = styled.button`
  border: 1px solid #b1b1b1;
  box-sizing: border-box;
  border-radius: 4px;
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
  padding: 7px 14px;
  cursor: pointer;
  margin-right: 13px;
  background-color: transparent;
`;

const TextButton = styled.button`
  box-sizing: border-box;
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  font-size: 18px;
  padding: 0;
  cursor: pointer;
  border: none;
  background-color: transparent;
  margin-left: auto;
  margin-bottom: 8px;
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-width: min(50vw, 720px);
  width: auto;
  max-width: 95vw;
  max-height: 95vh;
  background: #ffffff;
  padding: 30px 50px 50px 50px;
  border-radius: 4px;
  box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.2);

  textarea {
    background: #ffffff;
    border: 1px solid #e2e2e2;
    box-sizing: border-box;
    box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }

  a,
  button {
    cursor: pointer;
  }

  & .row {
    min-width: 100%;
  }

  .react-select {
    min-width: 200px;
  }
`;

const Container = styled.div`
  padding: 0.5rem;
  overflow: auto;
`;

export {
  Header,
  Row,
  TextInput,
  SimpleButton,
  ModalContainer,
  TextButton,
  StyledButton,
  Container,
  SuccessToaster,
  ErrorToaster,
};
