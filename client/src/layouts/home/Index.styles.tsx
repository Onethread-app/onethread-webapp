import styled from 'styled-components';
import { CompanyContainer } from 'components/home/company-section/CompanySection.styles';

const SuccessToaster = styled.div`
  padding: 30px 39px 30px 20px;
  border: none;
  border-left: 3px solid #00a150;
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  z-index: 10000;
`;

const ErrorToaster = styled.div`
  padding: 30px 39px 30px 20px;
  border: none;
  border-left: 3px solid red;
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  z-index: 10000;
`;

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
  padding: 0.5rem 0;
  column-gap: 4px;
  color: #000000;
  font-weight: 600;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  /* row-gap: 0.25rem; */
  padding: 0px 30px;
  width: 100%;
  min-height: 100%;
  background-color: #f1f1f1;

  form {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  ${CompanyContainer} {
    span {
      font-family: Poppins;
      font-style: normal;
      font-weight: normal;
      font-size: 10px;
      line-height: 15px;
      letter-spacing: 0.16em;
      color: #323030;
    }
  }
`;

export { Container, Row, Avatar, SuccessToaster, ErrorToaster };
