import styled from 'styled-components';

import { AlignCenter } from 'components/UtilComponents';

export const SortIcon = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledDataContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const StyledTableData = styled(StyledDataContainer)`
  width: ${(props) => `${100 / props.cols}%`};
`;

export const StyledSubRowData = styled(StyledDataContainer)`
  &:nth-child(2) {
    flex-grow: 1;
    justify-content: start;
  }

  &:last-child {
    min-width: 18%;
  }
`;

export const StyledProjectTableData = styled(StyledTableData)`
  &:first-child {
    justify-content: start;
  }
`;

export const StyledTaskTableData = styled(StyledTableData)`
  &:not(:first-child) {
    width: ${(props) => `${100 / (props.cols - 1)}%`};
  }

  &:nth-child(2) {
    width: 24px;
  }

  &:nth-child(2),
  &:nth-child(3) {
    display: -webkit-box;
    margin: auto 0;
    justify-content: start;
  }
`;

export const StyledTableRow = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  padding: 14px;
  cursor: pointer;
  width: 100%;
`;

export const StyledSubRow = styled(StyledTableRow)`
  padding: 0.75rem 1.5rem;
  background: #f8f8f8;

  &:not(:last-child) {
    border-bottom: 1px solid #e8e8e8;
  }
`;

export const StyledTableRowContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);

  &:first-child {
    border-radius: 8px 8px 0 0;
  }

  &:last-child {
    border-radius: 0 0 8px 8px;

    ${StyledSubRow} {
      &:last-child {
        border-radius: 0 0 8px 8px;
      }
    }
  }

  &:not(:last-child) {
    border-bottom: 1px solid #e8e8e8;
  }
`;

export const StyledSubRowBody = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
`;

export const StyledTableBody = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 760px;

  &:hover {
    ${StyledSubRow} {
      &:last-child {
        border-radius: 8px;
      }
    }
  }

  /* ${StyledTableRowContainer} {
    transition: all 0.2s ease-in;

    &:hover {
      transform: scale(1.02, 1);
      border-radius: 8px;
    }

    &:active {
      transform: scale(1);
    }
  } */
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
  margin-top: 0.5rem;
  padding: 0.25rem;

  @media only screen and (max-width: 768px) {
    overflow-x: auto;
  }

  .row .is-favourite {
    visibility: hidden;
  }

  .row:hover {
    .is-favourite {
      visibility: visible;
    }
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
  align-items: center;
  justify-content: flex-end;
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

export const Header = styled.div`
  font-weight: 500;
  font-size: 20px;
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

  > div {
    width: calc(100% / 3);
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 2rem 0 0 0;
  flex-grow: 1;

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

export const CreatableItem = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin: auto;
  margin-top: 4px;
  cursor: pointer;
  color: black;
  height: 49px;
  width: 100%;
  border: 1px dashed #cacaca;
  box-sizing: border-box;
  border-radius: 8px;
  padding: 0 1rem;

  span {
    color: var(--secondary-bg-color);
    margin-right: 4px;
  }
`;
