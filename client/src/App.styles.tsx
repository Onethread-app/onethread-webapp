import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    --primary-color: #000000;
    --secondary-color: #ffffff;
    --accent-color: ;
    --primary-bg-color:#E5E5E5;
    --secondary-bg-color: #34B3E9;
    --disabled-color: gray;
    --dark-color: #000000;
  }

  body.dark{
    --primary-color: #ffffff;
    --secondary-color: #000000;
    --accent-color: ;
    --primary-bg-color:#303053;
    --secondary-bg-color: transparent;
    --disabled-color: red;
    --dark-color: #000000;
  }
`;

export default GlobalStyle;
