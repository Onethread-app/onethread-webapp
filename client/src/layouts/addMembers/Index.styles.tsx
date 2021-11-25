import styled from 'styled-components';

import bgPng from '../../resources/images/Bg-png.png';

import {
  StyledButton as Button,
  StyledMultiEmail,
  StyledTextInput,
} from 'components/form-components/Index.styles';
import { Link } from 'react-router-dom';

const StyledButton = styled(Button)`
  font-weight: normal;
  width: 90px;
  height: 3rem;
  padding: 0;
`;

const SmallText = styled.p`
  font-size: 12px;
  color: gray;
`;

const StyledText = styled.p`
  font-weight: bold;
  font-size: 24px;
  color: #504f4f;
  margin-top: -0.5rem !important;
`;

const StyledLinkContainer = styled.div`
  padding: 0 0 0 1rem;
  width: 100%;
  border: none;
  background-color: #c7e4fc;
  border-radius: 6px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  input {
    border: none;
    background-color: transparent;
    outline: none;
    width: 30rem;
  }

  input:focus {
    font-weight: bold;
  }

  ${StyledButton} {
    margin-top: auto !important;
    outline: none;
  }

  &::focus-within {
    border: 2px solid var(--primary-bg-color, #08a0f7);
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  column-gap: 1rem;
`;

const Modal = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  position: absolute;
  z-index: 100;
  box-shadow: 0 0 5px 1px black;
  padding: 2rem 4rem;
  top: 50%;
  left: 25%;
  transform: translate(-50%, -50%);

  ${StyledButton} {
    margin-top: 1rem !important;
  }

  @media (max-width: 721px) {
    left: 50%;
    max-width: 100vw;

    span {
      flex-direction: column;
    }
  }
`;

const SmallContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  row-gap: 0.5rem;

  @media (min-width: 721px) {
    flex-direction: row;
    gap: 1rem;
  }

  ${StyledButton}[data-button='danger'] {
    --primary-bg-color: #f44336;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white !important;
  min-height: 100vh;
  height: ${(props) => `${props.height}px` || '100%'};
  width: 100%;
  background-image: url(${bgPng});
  background-size: cover;
  background-repeat: no-repeat;
  background-color: rgb(6, 5, 23);
  background-attachment: fixed;
  z-index: 0;
  padding: 0;
  margin: auto;

  * {
    max-width: 80%;
  }
`;

const TextLink = styled(Link)`
  text-decoration: none;
  font-size: large;
  color: black;

  &:hover {
    color: black;
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
  row-gap: 1.5rem;

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
    font-weight: 600;
  }

  form p {
    max-width: var(--max-width, 30rem);
    font-size: small;
    margin-top: 4px !important;
    color: gray;
  }

  form div {
    min-height: 150px;
    justify-content: flex-start !important;
    align-items: flex-start !important;
  }

  form div > div {
    min-height: 3rem;
    max-height: 300px;
    align-items: center !important;
  }

  form ${Row} {
    align-items: center !important;
    justify-content: space-between !important;

    min-height: 50px !important;
    max-height: 50px !important;
  }

  form::first-child[div] {
    justify-content: flex-start;
  }

  div p {
    margin-top: 5rem;
  }

  p a {
    color: #08a0f7;
    text-decoration: underline;
  }

  form div {
    display: flex;
    justify-content: space-between;
    align-items: center;

    ${TextLink} {
      color: var(--primary-color, #08a0f7);
    }
  }

  ${StyledTextInput} {
    margin-bottom: 2rem;
    margin-top: 1rem;
    width: 100%;
    max-width: var(--max-width, 30rem);
  }

  ${TextLink} {
    display: flex;
    justify-content: center;
    align-items: center;
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

  ${StyledButton}:focus {
    outline: none;
    box-shadow: 0 0 0 3px var(--primary-bg-color, #08a0f7);
  }

  ${StyledButton}:disabled {
    --primary-bg-color: gray;
    pointer-events: none;
  }

  ${StyledMultiEmail} {
    row-gap: 0.5rem !important;

    input {
      height: 3rem !important;
    }
  }

  @media (max-width: 1367px) {
    --default-margin: 0.5rem;
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
    }
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

export {
  Container,
  FormContainer,
  ImageContainer,
  Logo,
  TextLink,
  Modal,
  SmallContainer,
  StyledText,
  StyledLinkContainer,
  SmallText,
  Row,
  StyledButton,
};
