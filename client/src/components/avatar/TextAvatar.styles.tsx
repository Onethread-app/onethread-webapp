import styled from 'styled-components';

export const NameAvatar = styled.div`
  width: ${props => props.small ? '24px' : '40px'} ;
  height: ${props => props.small ? '24px' : '40px'} ;
  background: ${props => props.small ? '#34B3E9' : '#9840dd'} ;
  color: #fff;
  border-radius: ${props => props.small ? '50%' : '5px'} ;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
`;

export const SmallNameAvatar = styled.div`
  width: 24px;
  height: 24px;
  background: ${(props) => props.bgColor || '#9840dd'};
  color: #fff;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  font-size: 10px;
  font-weight: bold;
`;

export const CompanyNameAvatar = styled.div`
  width: 80px;
  height: 80px;
  background: #9840dd;
  color: #fff;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  font-size: 40px;
  cursor: pointer;
`;
