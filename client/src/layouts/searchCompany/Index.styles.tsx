import { Link } from 'react-router-dom';
import styled from 'styled-components';

import {
  StyledError,
  StyledButton,
} from '../../components/form-components/Index.styles';

const Column = styled.div`
  display: flex;
  flex-direction: column !important;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1024px;
  margin-left: auto;
  margin-right: auto;
  justify-content: flex-start;
  align-items: center;
  padding-top: 4rem;
  padding-left: 1rem;
  padding-right: 1rem;

  input {
    height: 47px;
    border-radius: 6px 0px 0px 6px;
    text-indent: 10px;
    width: 100%;
    border: 1px solid #c9c9c9;
    vertical-align: middle;
    border-right: none;
  }

  header {
    display: flex;
    font-size: 36px;
    padding-top: 1rem;
    padding-bottom: 1rem;
    text-align: center;
  }

  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  form label {
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  form p {
    max-width: 30rem;
    font-size: small;
    margin-top: 4px !important;
    color: black;
  }

  div {
    display: flex;
    flex-direction: row;
    width: 100%;
    max-width: 50rem;
  }

  p a {
    color: #08a0f7;
    text-decoration: underline;
  }

  ${StyledButton} {
    margin-top: 0;
    padding: 0 1rem;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  ${StyledError} {
    display: flex;
    margin-left: auto;
    margin-right: auto;
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1024px;
  margin: auto;
  justify-content: center;
  align-items: center;

  div {
    margin: 1rem 0.5rem;
    display: grid;
    grid-auto-flow: column;
    column-gap: 0.5rem;
    justify-content: center;
    align-items: center;
  }

  label {
    cursor: pointer;
    width: fit-content;
  }

  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  form input {
    visibility: hidden;
  }

  form div {
    display: flex;
    flex-wrap: wrap;
    max-height: 40vh;
    overflow-y: auto;
    width: 100%;
  }

  div.card {
    width: 100%;
    min-width: 281px;
    height: 81px;
    border: 1px solid #cdcdcd;
    border-radius: 10px;
    text-align: center;
    overflow-y: hidden;
    transition: color 300ms ease-in, background 300ms ease-in;

    span {
      display: none;
      color: transparent;
    }
  }

  input:checked + .card {
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
    background-color: var(--secondary-bg-color, #08a0f7);
    color: white;

    span {
      display: block;
      color: white;
      font-size: 18px;
    }
  }

  li {
    list-style-type: none;
  }

  ${StyledButton}:disabled {
    --primary-bg-color: gray;
    pointer-events: none;
  }
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const Container = styled.div`
  background: #fff;
  min-height: 100vh;

  @media (max-width: 721px) {
    ${FormContainer} {
      padding: 1rem;
    }
  }
`;

export { Container, FormContainer, TextLink, Wrapper, Row, Column };
