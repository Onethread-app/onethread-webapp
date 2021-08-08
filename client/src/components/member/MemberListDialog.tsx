import React from 'react';
import styled from 'styled-components';

import Avatar from '@material-ui/core/Avatar/Avatar';
import UserIcon from 'resources/images/profilePhoto.svg';

import { IBoardMember, ITaskMember } from 'stores/board/Reducer';

const Container = styled.div`
  padding: 0.5rem 1rem;
`;

const MemberContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5rem 0;
`;

const MemberName = styled.h3`
  font-size: 1rem;
  font-weight: 500;
  line-height: 25px;
  text-transform: capitalize;
  margin: 0;
`;

interface IMemberListDialog {
  members: IBoardMember[] | ITaskMember[];
}

const MemberListDialog = (props: IMemberListDialog) => {
  return (
    <Container>
      {props.members.map((member: IBoardMember | ITaskMember) => (
        <MemberContainer>
          <Avatar
            alt={`${member.firstName} ${member.lastName}`}
            src={member.profileImage ?? UserIcon}
            key={member._id}
            className="mr2"
            style={{
              width: '1.3rem',
              height: '1.3rem',
            }}
          />
          <MemberName>{`${member.firstName} ${member.lastName}`}</MemberName>
        </MemberContainer>
      ))}
    </Container>
  );
};

export default MemberListDialog;
