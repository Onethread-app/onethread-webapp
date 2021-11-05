import styled from 'styled-components';

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 16px 7px;
  height: 33px;
  white-space: nowrap;
  background: #08a0f7;
  border-radius: 4px;
  color: #fff;
  border: none;
  cursor: pointer;

  &:disabled {
    background: rgba(8, 160, 247, 0.6);
  }
`;

const ModalContainer = styled.div`
  background: #ffffff;
  padding: 50px 55px 50px 40px;
  border-radius: 4px;
  box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.2);
  min-width: min(600px, 100vw);
  min-height: min-content(480px, 80vh);

  .label {
    max-width: 150px;
  }

  .textarea {
    width: 100%;
    height: 100px;
    margin: 0.5rem 0;
    box-shadow: 0 0 0 0 rgb(19 124 189 / 0%),
      0 0 0 0 rgb(19 124 189 / 0%),
      inset 0 0 0 1px rgb(16 22 26 / 15%),
      inset 0 1px 1px rgb(16 22 26 / 20%);
  }

  .react-select {
    max-width: 300px;
    /* width: 50%; */
    max-height: 300px;
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
`;

const Container = styled.div``;

export { ModalContainer, Container, SimpleButton, StyledButton };
