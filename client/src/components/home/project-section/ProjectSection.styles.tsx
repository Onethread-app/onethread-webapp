import styled from 'styled-components';

import { StyledRadioInput as RadioInput } from 'components/form-components/Index.styles';

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

const Column = styled.div`
  display: flex;
  flex-direction: column !important;
  width: max-content;
  justify-content: flex-start;
  align-items: center;

  div {
    display: flex;
    flex-direction: column !important;
  }
`;

const Icon = styled.span`
  padding: 12px;
  background-color: ${({ color }) => color};
  border-radius: 100%;
  width: 24px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  outline: 4px solid
    ${({ checked }) => (checked ? '#e1e1e1' : 'transparent')};

  span {
    display: ${({ checked }) => (checked ? 'block' : 'none')};
  }
`;

const StyledRadioInput = styled(RadioInput)`
  opacity: 0;
  width: 0;
  height: 0;
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
      hasError
        ? '1px transparent !important'
        : '1px #08a0f7 !important'};
  }
`;

const Header = styled.header`
  font-weight: 500;
  font-size: 20px;
  line-height: 27px;
  display: flex;
  flex-direction: row;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${({ justify }) => justify ?? 'center'};
  align-items: center;
  width: 100%;
  padding: 1rem 0;
  column-gap: 4px;
  margin: 0.5rem 0;

  input[type='date'],
  select {
    min-width: 167px;
    height: 30px;
    border: 1px solid #b1b1b1;
    box-sizing: border-box;
    border-radius: 4px;
  }

  div {
    display: flex;
    column-gap: 0.5rem;
  }
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row !important;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 32px;
  margin-top: auto;
  border-top: 1px solid #e8e8e8;

  span {
    width: 50%;
    height: 100%;
  }

  span + span {
    border-left: 1px solid #e8e8e8;
  }
`;

const Project = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 128px;
  height: 128px;
  background: #ffffff;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  cursor: pointer;

  div {
    text-align: center;
  }

  &::first-child > span {
    font-family: Poppins;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 19px;
    text-align: center;
    color: #000000;
  }

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 5px;
  }
`;

const Avatar = styled.div`
  text-transform: capitalize;
  /* margin: 24px auto 4px; */
  padding: 12px;
  background-color: ${(props) => props.bgColor || '#9840dd'};
  border-radius: 5px;
`;

const CreateProject = styled.div`
  width: 120px;
  height: 126px;
  border: 1px dashed #a3a3a3;
  box-sizing: border-box;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    margin-top: 38.5px auto 0;
    margin-bottom: 12px;
  }
`;

const ProjectContainer = styled.div`
  background-color: #f6f6f6;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  column-gap: 24px;
  padding: 14px;
  margin-bottom: 36px;
  overflow-x: auto;
`;

const ModalContainer = styled.div`
  background: #ffffff;
  padding: 50px 55px 50px 40px;
  border-radius: 4px;
  box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.2);
  min-width: min(300px, 90vw);
  min-height: min(280px, 80vh);

  .label {
    min-width: 120px;
  }

  .react-select {
    /* width: 250px; */
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
  background-color: #ffffff;
`;

const Container = styled.div``;

export {
  Header,
  Footer,
  Project,
  Avatar,
  Row,
  CreateProject,
  ProjectContainer,
  ModalContainer,
  Container,
  SimpleButton,
  StyledRadioInput,
  Icon,
  Column,
  StyledButton,
};
