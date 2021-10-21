import styled from 'styled-components';

const Header = styled.header`
  font-weight: 500;
  font-size: 18px;
  line-height: 27px;
  color: var(--dark-color, #323030);
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
  transform: rotate(0.13deg);
  display: flex;
  justify-content: space-between;
  align-items: center;

  img {
    margin-right: 12px;
    cursor: pointer;
  }
`;

const Row = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  width: 100%;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: row !important;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 32px;
  margin: 0;
  margin-top: auto;
  border-top: 1px solid #e8e8e8;

  span {
    width: 50%;
    height: 100%;
  }

  span + span {
    border-left: 1px solid #e8e8e8;
  }
`;

const Company = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 128px;
  height: 128px;
  background: #ffffff;
  box-shadow: 0px 0px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  cursor: pointer;
  color: #000;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  div {
    text-align: center;
  }

  &::first-child > span {
    font-family: Poppins;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 19px;
    text-align: center;
    color: #000000;
  }

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    column-gap: 5px;
    /* margin: 0 8px; */
  }
`;

const Avatar = styled.div`
  text-transform: capitalize;
  color: #fff;
  margin: 24px auto 4px;
  background-color: ${(props) => props.bgColor || '#9840dd'};
  border-radius: 5px;
  width: 32px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;

  & + span {
    display: block;
    width: 100%;
    margin: 0;
    margin-top: 10px;
    padding-left: 8px;
    padding-right: 8px;
    font-family: Poppins;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 19px;
    text-align: center;
    color: #000000;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

const CreateCompany = styled.div`
  width: 120px;
  height: 126px;
  border: 1px dashed #a3a3a3;
  box-sizing: border-box;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: 200ms transform ease-in-out;

  img {
    margin-top: 38.5px auto 0;
    margin-bottom: 12px;
  }

  &:hover {
    transform: scaleX(1.05);
  }
`;

const CompanyContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  column-gap: 24px;
  padding: 14px;
  margin-bottom: 36px;
  overflow-x: auto;
`;

export {
  Header,
  Footer,
  Company,
  Avatar,
  Row,
  CreateCompany,
  CompanyContainer,
};
