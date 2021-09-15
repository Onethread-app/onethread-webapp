import styled from 'styled-components';

export const ModalWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  backdrop-filter: blur(1px);
  background-color: rgba(0, 0, 0, 0.1);
`;

export const Modal = styled.div`
  position: absolute;
  background: #fff;
  top: 10%;
  left: 6%;
  right: 5%;
  bottom: 10%;
  overflow-y: auto;
  overflow-x: hidden;
  border: 0.5px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.2);
  z-index: 6;
`;

export const CloseButton = styled.div`
  height: 16px;
  width: 16px;
`;
