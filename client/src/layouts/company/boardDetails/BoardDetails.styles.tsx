import styled from 'styled-components';

export const Container = styled.div`
  background: #fff;
  font-family: 'Poppins', sans-serif;
`;

export const ProjectName = styled.h3`
  font-size: 28.9886px;
  font-weight: 500;
  line-height: 150%;
  text-align: center;
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #323030;
  text-transform: capitalize;
`;

export const SortingDiv = styled.div`
  display: flex;
  width: fit-content;
  color: #a4a4a4;
  font-size: 12px;
  font-weight: 600;
  line-height: 150%;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;

  p {
    margin-bottom: 0;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }

  span {
    color: #656565;
    cursor: pointer;
  }
`;

export const ViewSelectDiv = styled.div`
  width: fit-content;
  gap: 0.5rem;
  color: #a4a4a4;
  font-size: 12px;
  font-weight: 600;
  line-height: 150%;
  padding: 0.25rem 1rem;
  border-radius: 5px;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
    rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;

  p {
    color: #656565;
    margin-bottom: 0;
    border-radius: 4px;
    padding: 0.25rem 0;

    &:not(:first-child) {
      cursor: ${(props) =>
        props.fetchingBoard ? 'not-allowed' : 'pointer'};
      padding: 0.25rem 0.5rem;
    }

    &.active {
      background: #e5e5e5;
      color: #182026;
    }
  }
`;

export const TasksNumber = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;

  h3 {
    font-weight: 600;
    font-size: 24px;
    line-height: 36px;
    color: #323030;
    margin: 0;
  }

  span {
    font-size: 14px;
    line-height: 21px;
    text-align: center;
    color: #000000;
  }
`;

export const SecondaryHeader = styled.div`
  > div {
    width: calc(100% / 3);
  }

  @media only screen and (max-width: 768px) {
    gap: 0.5rem;

    > div {
      width: 50%;

      &:first-child {
        width: 100%;
        order: 2;
      }
    }
  }
`;
