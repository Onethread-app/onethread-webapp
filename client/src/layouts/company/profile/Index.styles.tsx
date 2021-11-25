import styled from 'styled-components';

export const ProfileContainer = styled.div`
  background: #f6f6f6;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 1rem 4rem;

  .header {
    display: flex;
    margin-bottom: 4rem;
  }

  .small-text {
    font-size: 10px;
  }

  .capitalize {
    text-transform: capitalize;
  }

  .about {
    font-family: Poppins;
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 27px;
    color: #323030;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e0e0e0;
  }

  .company-name {
    text-transform: capitalize;
    font-family: Poppins;
    font-style: normal;
    font-weight: 600;
    font-size: 30px;
    line-height: 45px;
  }

  .simple-button {
    border: 1px solid #b1b1b1;
    box-sizing: border-box;
    border-radius: 4px;
    padding: 7px 14px;
    font-size: 12px;
    cursor: pointer;
    background-color: #fff;
    height: 30px;
    margin: auto 0 auto auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .profile {
    width: 80px;
    height: 80px;
  }
`;

export const Table = styled.div`
  background: #fff;
  width: 100%;
  border-radius: 8px;
  margin-top: 1rem;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);

  div {
    height: 45px;
    display: flex;
  }

  & > div + div {
    border-top: 1px solid #e0e0e0;
  }

  span {
    width: 50%;
    height: auto;
    display: flex;
    align-items: center;
    padding: 0 1rem;
  }
`;
