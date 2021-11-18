import styled from 'styled-components';

import Avatar from '@material-ui/core/Avatar/Avatar';

import { IAccount } from 'stores/task/Reducer';

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
  members: IAccount[];
}

const MemberListDialog = (props: IMemberListDialog) => {
  console.log(props.members);
  return (
    <Container>
      {props.members.map((member: IAccount) => (
        <MemberContainer key={member._id}>
          <Avatar
            alt={`${member?.firstName} ${member?.lastName}`}
            src={member?.profileImage ?? UserIcon}
            key={member?._id}
            className="mr2"
            style={{
              width: '1.3rem',
              height: '1.3rem',
              borderRadius: '10%',
              zIndex: 0,
            }}
          />
          <MemberName>{`${member?.firstName} ${member?.lastName}`}</MemberName>
        </MemberContainer>
      ))}
    </Container>
  );
};

export default MemberListDialog;
