import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    --primary-color: white;
    --secondary-color: ;
    --accent-color: ;
    --primary-bg-color:#34B3E9;
    --secondary-bg-color: transparent;
    --disabled-color: gray;
    --dark-color: black;
  }

  body.dark{
    --primary-color: white;
    --secondary-color: ;
    --accent-color: ;
    --primary-bg-color:#303053;
    --secondary-bg-color: transparent;
    --disabled-color: red;
    --dark-color: black;
  }
`;

export default GlobalStyle;
