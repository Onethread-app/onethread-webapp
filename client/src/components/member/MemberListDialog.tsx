import styled from 'styled-components';

import Avatar from '@material-ui/core/Avatar/Avatar';

import { ITaskMember } from 'stores/task/Reducer';

import UserIcon from 'resources/images/profilePhoto.svg';

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
  members: ITaskMember[];
}

const MemberListDialog = (props: IMemberListDialog) => {
  return (
    <Container>
      {props.members?.map((member: ITaskMember) => (
        <MemberContainer key={member?._id}>
          <Avatar
            alt={`${member?.assignedPerson.firstName} ${member?.assignedPerson.lastName}`}
            src={member?.assignedPerson.profileImage ?? UserIcon}
            key={member?.assignedPerson._id}
            className="mr2"
            style={{
              width: '1.3rem',
              height: '1.3rem',
              borderRadius: '10%',
              zIndex: 0,
            }}
          />
          <MemberName>{`${member?.assignedPerson.firstName} ${member?.assignedPerson.lastName}`}</MemberName>
        </MemberContainer>
      ))}
    </Container>
  );
};

export default MemberListDialog;
