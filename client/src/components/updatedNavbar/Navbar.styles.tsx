import styled from 'styled-components';

export const Avatar = styled.div`
  text-transform: uppercase;
  background-color: ${(props: { bgColor: string }) =>
    props.bgColor || '#4ee0d7'};
  border-radius: 5px;
  color: white;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  display: grid;
  place-content: center;
  cursor: pointer;
`;

export const Container = styled.div`
  width: 100%;
  background-color: #ffffff;
  display: flex;
  justify-content: space-between;
  align-items: center;

  input {
    width: 313px;
    height: 33px;
    border: 1px solid #e0e0e0;
    box-sizing: border-box;
    border-radius: 4px;
    margin: 14px 0 14px 32px;
    text-indent: 10px;
  }

  .nav-buttons-container {
    display: flex;
    column-gap: 1rem;
    margin: 0 2rem;
    align-items: center;
    padding: 0.5rem 0;
  }

  .create-button {
    padding: 8px 16px 7px;
    background: #08a0f7;
    border-radius: 4px;
    color: white;
    display: flex;
    align-items: center;

    &:hover {
      background: #08a0f7;
      color: white;
    }
  }

  .popover {
    .bp3-popover-arrow {
      right: 20px !important;
    }
  }

  .bp3-popover-wrapper {
    display: flex;
    align-items: center;
  }
`;

export const CreateDialogList = styled.div`
  background: #ffffff;
  border-radius: 8px;
  width: 176px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  flex-direction: column;
  row-gap: 0.5rem;
  padding: 25px 0 19px 29px;

  div {
    cursor: pointer;
  }

  div:hover {
    font-weight: 600;
  }
`;

export const ProfilePicture = styled.img`
  display: flex;
  align-items: center;
  width: 32px;
  height: 32px;
  cursor: pointer;
  border-radius: 5px;
  margin: auto 0;
`;
