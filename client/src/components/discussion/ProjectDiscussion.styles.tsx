import styled from 'styled-components';

import { Avatar } from 'components/updatedNavbar/Navbar.styles';
import { NavLink } from 'react-router-dom';

export const StyledImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 4px;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  margin: 1rem auto;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 0 0.5rem;

  .title {
    font-weight: 500;
    font-size: 18px;
    line-height: 27px;
  }

  .search {
    width: 100%;
    border: 1px solid #e0e0e0;
    box-sizing: border-box;
    border-radius: 4px;
    padding: 0.75rem 1rem;
    margin: 10px 0 15px;
  }
`;

export const List = styled(NavLink)`
  display: flex;
  flex-direction: row;
  padding: 0.75rem 1rem;
  background: ${(props) => (props.active ? '#fff' : 'transparent')};
  color: #323030;
  font-size: 14px;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${(props) =>
    props.active ? '0px 3px 8px rgba(0, 0, 0, 0.05)' : 'none'};
  border-radius: 8px;

  &:hover {
    color: #323030;
  }

  span {
    color: #919191;
  }

  .black {
    color: #323030;
  }
`;

export const DiscussionViewContainer = styled.div`
  width: 100%;
  background: #ffffff;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  background: #fff;
  display: flex;
  flex-direction: column;
  margin: 0.5rem 0 0 2rem;
  height: 70vh;

  .divider {
    width: calc(100%-2rem);
    margin: 0 1rem 1rem;
    border: 1px solid #e0e0e0;
  }
`;

export const CommentContainer = styled.div`
  height: 100px;
  display: flex;
  background: #fff;
  padding: 20px 25px;
  border-top: 1px solid #e0e0e0;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  align-items: flex-start;
  position: relative;
  margin: 0;

  .comment-buttons {
    width: 100px;
    display: flex;
    flex-direction: row;
    align-items: center;
    position: absolute;
    right: 110px;
  }
`;

export const CommentDiv = styled.div`
  display: flex;
  align-items: center;
  border-radius: 8px;
  width: 100%;
  max-width: 95%;
  margin: ${(props) =>
    props.rightJustify ? '0.5rem 0 0.5rem auto' : '0.5rem 0 0.5rem'};
  justify-content: ${(props) =>
    props.rightJustify ? 'flex-end' : 'flex-start'};

  .comment {
    background: #f2f2f2;
    padding: 8px 12px;
    margin: 0 0.5rem;
    max-width: 95%;
  }

  .is-favourite {
    /* display: none; */
    visibility: hidden;
  }

  &:hover .is-favourite {
    /* display: block; */
    visibility: visible;
    cursor: pointer;
  }
`;

export const FilesDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${(props) =>
    props.rightJustify ? '0.5rem 0 0.5rem auto' : '0.5rem 0 0.5rem'};
  justify-content: ${(props) =>
    props.rightJustify ? 'flex-end' : 'flex-start'};
  width: fit-content;
`;

export const CommentInput = styled.textarea`
  background: #ffffff;
  border: 1px solid #e2e2e2;
  box-sizing: border-box;
  box-shadow: inset 0px 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 90%;
  height: 60px;
  padding: 10px 100px 0 15px;
  margin: 0 2rem;
`;

export const Commenter = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(props) =>
    props.rightJustify ? 'flex-end' : 'flex-start'};
  margin-top: 0.5rem;

  .capitalize {
    text-transform: capitalize;
  }

  ${StyledImage} {
    width: 24px;
    height: 24px;
  }

  ${Avatar} {
    width: 24px;
    height: 24px;
    font-size: 10px;
  }
`;

export const DiscussionContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow: auto;
  width: 100%;
  height: 100%;
  flex-grow: 1;

  .message-container {
    display: flex;
    flex-direction: column;
    padding: 0 2rem;
    height: 100%;
    overflow: auto;
  }
`;
