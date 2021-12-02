import styled from 'styled-components';

export const LabelItem = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background: #e7e7e7;
  border-radius: 4px;
  padding: 2px 10px 2px 6px;
  margin: 0 10px 1rem 0;
  text-transform: capitalize;

  span {
    margin-left: 0.5rem;
    cursor: pointer;
    text-transform: lowercase;
  }
`;

export const LabelContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
`;

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
    cursor: not-allowed;
  }
`;

const Header = styled.header`
  font-weight: 500;
  font-size: 20px;
  line-height: 27px;
  display: flex;
  flex-direction: row;
  align-items: center;

  .bp3-icon {
    font-size: 14px;
    line-height: 21px;
    border: 1px solid rgba(0, 0, 0, 0);
    border-radius: 4px;
    padding: 0.25rem;
    transition: all 0.2s ease-in;

    &:hover {
      border: 1px solid #575757;
      border-radius: 4px;
      padding: 0.25rem;
    }
  }
`;

export const TextInput = styled.input`
  height: 36px !important;
  border-radius: 4px;
  width: 100%;
  border: ${({ hasError }) =>
    hasError ? '1px solid red !important' : 'none'};
  vertical-align: middle;
  font-weight: 400;
  margin-top: 4px;
  text-indent: 0px;
  background-color: #fff;
  width: 100%;
  box-shadow: rgb(0 0 0 / 2%) 0px 1px 3px 0px,
    rgb(27 31 35 / 15%) 0px 0px 0px 1px;
  padding: 0.5 rem;
  color: #000 !important;
  text-indent: 5px;

  & + span {
    color: ${({ hasError }) =>
      hasError ? 'red !important' : 'inherit'};
  }

  &:focus {
    outline: ${({ hasError }) =>
      !hasError
        ? '1px #08a0f7 !important'
        : '1px transparent !important'};
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

const Container = styled.div`
  padding: 0.5rem 0;
  overflow: auto;

  textarea {
    background: #ffffff;
    box-sizing: border-box;
    box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    height: 138px;
    width: 100%;
    padding: 0.5rem;
  }

  .due-date-input {
    box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    border-radius: 4px;
    font-size: 14px;
  }
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

  a,
  button {
    cursor: pointer;
  }

  & .row {
    min-width: 100%;
  }

  .react-select {
    min-width: 200px;
    max-width: 100%;
    word-wrap: break-word;
    box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    border-radius: 4px;
    font-size: 14px;
  }

  ${Container} {
    padding: 0.5rem;
  }
`;

export const Row = styled.div`
  display: flex;
  column-gap: 18px;
  padding: 1rem 0 0rem 0.5rem;
  justify-content: flex-start;
  align-items: center;
`;

export const SimpleTextButton = styled.button`
  box-sizing: border-box;
  padding: 0;
  cursor: pointer;
  border: none;
  background-color: transparent;
  color: #5a5a5a;
  font-family: Poppins;
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
  color: #5a5a5a;
  display: flex;
  align-items: center;

  :focus {
    outline: none;
  }

  :disabled {
    color: #bbbbbb;
    cursor: not-allowed;
  }
`;

export {
  Header,
  SimpleButton,
  ModalContainer,
  TextButton,
  StyledButton,
  Container,
  SuccessToaster,
  ErrorToaster,
};
