import CloseIcon from '@material-ui/icons/Close';

import UserIcon from 'resources/images/profilePhoto.svg';

interface IMembersList {
  members: any;
  setShowAllMembers: React.Dispatch<React.SetStateAction<boolean>>;
}

const MembersList = (props: IMembersList) => (
  <div className='flex flex-column w-100 pa4'>
    <CloseIcon
      className='self-end pointer'
      style={{
        marginTop: '-1rem',
        marginRight: '-1rem',
      }}
      onClick={() => props.setShowAllMembers(false)}
    />
    <div className='flex w-100 bb pb2 mb2 ma1'>
      <div className='w-40 f5-ns f6 fw7'>Member</div>
      <div className='w-40 f5-ns f6 fw7'>Email</div>
      <div className='w-20 tc f5-ns f6 fw7'>Role</div>
    </div>
    <div
      className='flex flex-column w-100 ma1 overflow-y-auto'
      style={{ maxHeight: '380px' }}
    >
      {props.members.map((member: any) => (
        <div className='flex w-100 mv2'>
          <div className='w-40 f5-ns f6 fw5 ttc flex items-center'>
            <img
              src={member.member!.account!.profileImage ?? UserIcon}
              alt={`${member.member!.account!.firstName} ${
                  member.member!.account!.lastName
              }`}
              style={{
                width: '27px',
                height: '27px',
                borderRadius: '50%',
                marginRight: '.5rem',
              }}
            />
            <h4>
              {`${member.member!.account!.firstName} ${
                  member.member!.account!.lastName
              }`}
            </h4>
          </div>
          <div className='w-40 f5-ns f6 fw5'>
            {member.member!.account!.email}
          </div>
          <div className='w-20 f5-ns f6 fw5 ttc tc'>
            {member.role}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default MembersList;
