import styled from 'styled-components';

import bgPng from '../../resources/images/Bg-png.png';

import {
  StyledButton as Button,
  StyledTextInput,
} from 'components/form-components/Index.styles';
import { Link } from 'react-router-dom';
import { TextInput as Input } from 'components/form-components/styles/StyledTextInput';

const TextInput = styled(Input)`
  border-color: ${(props) => (props.error ? props.error : 'c9c9c9')};

  & + span {
    position: absolute;
    top: 25%;
    right: 10px;
  }

  & + p {
    color: ${(props) => (props.error ? props.error : 'c9c9c9c')};
  }
`;

const Logo = styled(Link)`
  font-weight: normal;
  font-size: 20px;
  margin-bottom: var(--default-margin, 1rem);
  color: black !important;

  span {
    font-weight: bold;
  }
`;

const StyledButton = styled(Button)`
  font-weight: normal;
  height: 3rem;
  padding: 0.5rem;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  min-height: 100vh;
  height: ${(props) => `${props.height}px` || '100%'};
  width: 100%;
  background-image: url(${bgPng});
  background-size: auto 100%;
  background-repeat: no-repeat;
  background-color: rgb(6, 5, 23);
  background-attachment: fixed;
  z-index: 0;
  padding: 0;

  div {
    height: 100%;
  }

  ${Logo} {
    color: white;
  }

  * {
    max-width: 80%;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
  padding-top: clamp(50px, 25px, 100px);
  padding-left: 100px;
  padding-right: 100px;
  row-gap: var(--default-margin, 1rem);

  form div {
    position: relative;
    max-width: var(--max-width);

    span {
      height: 1rem;
      width: 1rem;
    }
  }

  header {
    font-size: 36px;
  }

  form {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  form label {
    margin-top: var(--default-margin, 1rem);
    color: black;
    font-weight: normal;
    padding-bottom: 4px;
  }

  form p {
    max-width: var(--max-width, 30rem);
    font-size: small;
    margin-top: 4px !important;
    color: gray;
  }

  div p {
    margin-top: 5rem;
  }

  p a {
    color: #08a0f7;
    text-decoration: underline;
  }

  ${StyledTextInput} {
    margin-bottom: 2rem;
    margin-top: 1rem;
    width: 100%;
    max-width: var(--max-width, 30rem);
  }
`;

const Container = styled.div`
  --max-width: 35rem;
  --default-margin: 2rem;
  background: #fff;
  display: flex;
  flex-direction: row;
  margin: auto;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;

  ${FormContainer} input {
    max-width: var(--max-width);
  }

  @media (max-width: 1367px) {
    --default-margin: 1rem;
  }

  @media (max-width: 721px) {
    --max-width: 100%;

    ${ImageContainer} {
      display: none;
    }

    ${FormContainer} {
      align-items: center;
      margin-left: auto;
      margin-right: auto;
      padding: 1rem;
      text-align: center;

      ${StyledButton} {
        margin: auto;
        margin-top: 0.5rem;
      }

      a + a {
        margin-left: 1rem;
        margin-right: auto;
      }
    }
  }
`;

export {
  Container,
  FormContainer,
  ImageContainer,
  Logo,
  StyledButton,
  TextInput,
};
