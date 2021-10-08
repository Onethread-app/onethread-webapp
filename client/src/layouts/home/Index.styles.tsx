import styled from 'styled-components';

const Avatar = styled.div`
  text-transform: uppercase;
  /* margin: 24px auto 4px; */
  padding: 12px;
  background-color: ${(props) => props.bgColor || '#9840dd'};
  border-radius: 5px;
  color: white;
  margin-right: 0.5rem;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${({ justify }) => justify ?? 'center'};
  align-items: center;
  width: 100%;
  padding: 1rem 0;
  column-gap: 4px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.25rem;
  padding: 45px 80px;
  width: 100%;
  height: 100%;
  background-color: #f1f1f1;

  form {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  span {
    font-family: Poppins;
    font-style: normal;
    font-weight: normal;
    font-size: 10px;
    line-height: 15px;
    letter-spacing: 0.16em;
    color: #323030;
  }
`;

export { Container, Row, Avatar };
