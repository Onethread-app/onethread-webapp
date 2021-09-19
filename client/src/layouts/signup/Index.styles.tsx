import styled from 'styled-components';

import bgPng from '../../resources/images/Bg-png.png';

import { StyledButton as Button } from 'components/form-components/Index.styles';
import { Link } from 'react-router-dom';

const StyledButton = styled(Button)`
  font-weight: normal;
  width: 90px;
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
  height: 100%;
  width: 100%;
  background-image: url(${bgPng});
  background-size: cover;
  background-repeat: no-repeat;
  background-color: rgb(6, 5, 23);
  background-attachment: fixed;
  z-index: 0;
  padding: 0;

  a {
    color: white;
  }

  * {
    max-width: 80%;
    height: inherit;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  height: 5rem;
  align-items: center;
  margin-top: auto;
  margin-bottom: auto;

  ${StyledButton} {
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 4px;
  }
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: flex-start;
  padding-top: 100px;
  padding-left: 100px;
  padding-right: 100px;
  row-gap: 2rem;

  header {
    font-size: 36px;
  }

  form {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  form label {
    margin-top: 2rem;
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
    color: #34b3e9;
    text-decoration: underline;
  }

  form input {
    height: 3rem;
    min-width: min(30rem, 90%);
  }
`;

const Container = styled.div`
  --max-width: 35rem;
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
  Row,
  StyledButton,
};
