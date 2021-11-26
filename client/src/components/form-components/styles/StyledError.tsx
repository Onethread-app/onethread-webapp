import styled from 'styled-components';

interface IProps {
  errorMessage: any;
  style?: any;
}
const Error = styled.span({
  color: 'red',
  fontSize: '16px',
  marginTop: '0.5rem',
  width: '100%',
});

const StyledError = (props: IProps) => {
  return <Error>{props.errorMessage}</Error>;
};

export default StyledError;
