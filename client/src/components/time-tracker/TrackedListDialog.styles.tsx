import styled from 'styled-components';

export const TrackedListDialogContainer = styled.div`
  width: ${(props) => (props.width > 1440 ? '330px' : '280px')};
  max-height: ${(props) => (props.width > 1440 ? '350px' : '300px')};
  padding: 1rem 0.5rem;

  h3,
  h4 {
    margin: 0;
    font-weight: 500;
  }
`;

export const TrackItemListContainer = styled.div`
  width: ${(props) => (props.width > 1440 ? '315px' : '265px')};
  max-height: ${(props) => (props.width > 1440 ? '270px' : '220px')};
  overflow-y: auto;
  flex-grow: auto;
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0.35rem;

  gap: 0.25rem;

  &::-webkit-scrollbar {
    background-color: transparent;
  }

  ::-webkit-scrollbar-track {
    border: none;
  }

  &::-webkit-scrollbar-thumb {
    background: #dbdbdb;
    border: none;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
  }
`;

export const TrackItemContainer = styled.div`
  width: ${(props) => (props.width > 1440 ? '285px' : '237px')};
  max-height: 70px;
  border: 1px solid #e5e5e5;
  padding: 0.5rem;
  margin-left: 0.5rem;
  border-radius: 4px;

  p {
    margin: 0;
    font-size: 0.75rem;
  }
`;

export const TrackPart = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:nth-child(2) {
    > * {
      max-width: 75%;
    }
  }
`;
