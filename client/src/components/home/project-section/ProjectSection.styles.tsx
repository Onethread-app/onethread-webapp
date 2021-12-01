import styled from 'styled-components';

import {
  StyledTextInput,
  StyledRadioInput as RadioInput,
} from 'components/form-components/Index.styles';

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

const TextInput = styled(StyledTextInput)`
  height: 36px;
  border-radius: 0.5rem;
  width: 100%;
  border: ${({ hasError }) =>
    hasError
      ? '1px solid red !important'
      : '1px solid transparent !important'};
  vertical-align: middle;
  font-size: 24px;
  font-weight: bold;
  margin-top: 4px;
  text-indent: 0px;
  background-color: #fff;

  & + span {
    color: ${({ hasError }) =>
      hasError ? 'red !important' : 'inherit'};
  }

  &:focus {
    outline: none;
    font-weight: bolder;
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

export const CreateStatusContainer = styled.div`
  background: #ffffff;
  border-radius: 4px;

  .label {
    min-width: 120px;
  }

  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    column-gap: 1rem;
  }

  .column {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    row-gap: 0.5rem;
    margin: 0.25rem 0;
  }

  input {
    width: 200px;
    height: 30px;
    padding-left: 2rem;
    border: 1px solid #b1b1b1;
    box-sizing: border-box;
    border-radius: 4px;
  }

  .error {
    color: red;
  }

  .button-container {
    width: 100%;
    display: flex;
    margin-bottom: auto;
    margin-top: 1rem;
    column-gap: 1rem;
    justify-content: space-between;
    align-items: center;
  }

  .input-div {
    width: 200px;
    position: relative;
  }

  .status-container {
    display: grid;
    width: 100%;
    row-gap: 2px;
    height: auto;
    max-height: 250px;
    overflow-y: auto;
    padding: 0.25rem 1rem 0.25rem 0;
    z-index: 100;
    grid-template-columns: 1fr;
  }
`;

export const StatusGrid = styled.div`
  background: ${({ bg }) => bg};
  border-radius: 4px;
  color: ${({ color }) => color};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 8px 16px 7px;
  border: ${({ border }) => border};
  width: fit-content;
`;

export const StatusGridContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  width: 100%;
  max-width: 100%;
  row-gap: 1rem;
  column-gap: 1rem;
  margin-bottom: 1rem;
  padding: 0 1rem 0 0;
`;

export const Line = styled.div`
  width: 1rem;
  height: 2px;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ColorContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 200px;
  padding: 0.5rem;
`;

export const ColorItem = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background-color: ${({ bg }) => bg};
  cursor: pointer;
`;

export const CustomStatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 1rem 0;
  width: min(500px, 90vw);
`;

export const SelectColor = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background-color: ${({ bg }) => (bg ? bg : '#B1B1B1')};
  transform: ${({ translate }) => translate};
  cursor: pointer;
`;

export const ProjectHeader = styled.div`
  font-family: Poppins;
  font-style: normal;
  font-weight: 600;
  font-size: 24px;
  line-height: 36px;
  color: #323030;
  text-transform: capitalize;
  margin-bottom: 20px;
`;

export const Status = styled.div`
  background: ${({ bg }) => bg};
  border-radius: 3.31579px;
  padding: 4px 8px;
`;

export const StatusContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 1rem auto 50px;
  column-gap: 12px;
  color: white;
`;

export const StatusItem = styled.div`
  width: 200px;
  height: 30px;
  padding-left: 2rem;
  border: 1px solid #b1b1b1;
  box-sizing: border-box;
  border-radius: 4px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
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
  TextInput,
  StyledRadioInput,
  Icon,
  Column,
  StyledButton,
};
