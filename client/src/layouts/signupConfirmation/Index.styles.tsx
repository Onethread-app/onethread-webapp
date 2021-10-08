import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { StyledButton as Button } from 'components/form-components/Index.styles';

const Logo = styled(Link)`
  font-weight: normal;
  font-size: 20px;
  margin-bottom: 2rem;
  color: black !important;
  span {
    font-weight: bold;
  }
`;

const SmallContainer = styled.div`
  margin-top: 8rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const TextLink = styled(Link)`
  text-decoration: none;
  font-size: inherit;
  color: var(--secondary-bg-color, #34b3e9);

  &:hover {
    color: var(--secondary-bg-color, #34b3e9);
  }
`;

const StyledButton = styled(Button)`
  overflow: hidden;
  outline: none;
  font-weight: normal;
  width: 175px;
  height: 3.5rem;
  padding: 0;

  &::hover,
  &::focus {
    box-shadow: 0 0 4px 4px currentColor;
  }
`;

export { Logo, SmallContainer, TextLink, StyledButton };
