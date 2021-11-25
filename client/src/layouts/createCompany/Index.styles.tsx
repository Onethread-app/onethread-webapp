import { Link } from 'react-router-dom';
import styled from 'styled-components';
import bgPng from '../../resources/images/Bg-png.png';
import {
  StyledButton as Button,
  StyledTextInput,
} from '../../components/form-components/Index.styles';

const StyledButton = styled(Button)`
  font-weight: normal;
  width: 102px;
  height: 3rem;
  padding: 0;
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
  padding-top: 100px;
  padding-left: 150px;
  padding-right: 150px;
  row-gap: var(--default-margin, 1rem);

  header {
    font-size: 36px;
    text-transform: capitalize;
  }

  form {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  form label {
    margin-top: var(--default-margin, 1rem);
    margin-bottom: 1rem;
    color: black;
  }

  form p {
    max-width: var(--max-width, 30rem);
    font-size: small;
    margin-top: 4px !important;
    color: gray;
  }

  div p {
    margin-top: 2rem;
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

  ${StyledButton} {
    margin-top: 1rem;
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

const Logo = styled(Link)`
  font-weight: normal;
  font-size: 20px;
  margin-bottom: 2rem;
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
  StyledButton,
};
