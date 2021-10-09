import styled from 'styled-components';

import { AlignCenter } from 'components/UtilComponents';

export const SortIcon = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledTableData = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  font-weight: 500;
  width: ${(props) => `${100 / props.cols}%`};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const StyledProjectTableData = styled(StyledTableData)`
  &:first-child {
    justify-content: start;
  }
`;

export const StyledTaskTableData = styled(StyledTableData)`
  &:nth-child(2) {
    display: -webkit-box;
    margin: auto 0;
    justify-content: start;
  }
`;

export const StyledTableRow = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  background: #ffffff;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
  padding: 14px;
  cursor: pointer;

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;
  }

  &:not(:last-child) {
    border-bottom: 1px solid #e8e8e8;
  }
`;

export const StyledTableBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 760px;

  ${StyledTableRow} {
    transition: all 0.2s ease-in;

    &:hover {
      transform: scale(1.02, 1);
      border-radius: 8px;
    }

    &:active {
      transform: scale(1);
    }
  }
`;

export const StyledTableHeader = styled.div`
  display: flex;
  width: 100%;
  font-size: 10px;
  line-height: 15px;
  letter-spacing: 0.11em;
  color: #666666;
  min-width: 760px;

  ${StyledTableRow} {
    background: transparent;
    box-shadow: none;
    cursor: default;

    ${StyledTableData} {
      overflow: visible;
    }
  }
`;

export const StyledTable = styled.div`
  flex-grow: 1;
  background: transparent;
  display: flex;
  flex-direction: column;
  position: relative;
  max-width: 100%;
  margin-top: 1rem;
  padding: 0.25rem;

  @media only screen and (max-width: 768px) {
    overflow-x: auto;
  }
`;

export const StyledFilterPopover = styled.div`
  padding: 1rem;
`;

export const StyledInput = styled.input`
  height: 20px;
  min-width: 140px;
  width: auto;
  border: 1px solid #575757;
  outline: none;
  vertical-align: middle;
  border-radius: 4px;
  padding: 0.25rem;
  font-size: 14px;

  @media only screen and (max-width: 768px) {
    min-width: 100px;
    font-size: 10px;
  }
`;

export const SortAndFilter = styled.div`
  display: flex;
  gap: 1rem;
  color: #5a5a5a;

  svg {
    fill: #575757;
    cursor: pointer;
  }

  ${AlignCenter} {
    gap: 0.25rem;
    cursor: pointer;
  }

  @media only screen and (max-width: 768px) {
    gap: 0.25rem;
  }
`;

export const Header = styled.h3`
  font-weight: 500;
  font-size: 18px;
  line-height: 27px;

  span {
    font-size: 14px;
    line-height: 21px;
  }
`;

export const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #cfcfcf;
  padding: 0 0.25rem 0.5rem;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 2rem 0 0 0;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p {
    margin: 0;
    padding: 0;
  }
`;
