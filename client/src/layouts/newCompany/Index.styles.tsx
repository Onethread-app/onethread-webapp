import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  min-height: min(100vh, 100%);
  padding: 0rem 2rem 0 2rem;
  color: #323030;
  background: #f1f1f1;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

export const DashboardP = styled.p`
  font-size: 10px;
  line-height: 15px;
  letter-spacing: 0.16em;
`;

export const CompanyOptions = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CompanyIconAndName = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: ${(props) => (props.noMarginBottom ? '0' : '1rem')};
`;

export const CompanyName = styled.h3`
  font-weight: 600;
  font-size: 24px;
  line-height: 36px;
  text-transform: capitalize;
  margin: 0;
  padding: 0;
`;

export const CompanyEditButton = styled.div`
  border: 1px solid #b1b1b1;
  box-sizing: border-box;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.3s ease-in;

  &:hover {
    transform: scale(1.025);
  }

  &:active {
    transform: scale(1);
  }
`;
