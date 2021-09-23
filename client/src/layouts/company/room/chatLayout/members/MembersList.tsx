import { useSelector } from 'react-redux';

import { IRoomReducer } from 'stores/room/Reducer';
import { IPusherReducer } from 'stores/pusher/Reducer';

interface MembersListProps {
  users: IRoomReducer['users'];
}
export const MembersList = (props: MembersListProps) => {
  const allUsers: IPusherReducer['users'] = useSelector(
    (state: any) => state.pusherReducer.users,
  );

  return (
    <div className='pa3'>
      <h1 className='f4 tigrow-lightBlue'>Room members</h1>
      <div className=''>
        {props.users.length
          ? props.users.map((user, i: number) => (
            <article
              key={user._id}
              className={`flex items-center w-100 pv1 ${
                i !== props.users.length - 1 ? 'bb' : ''
              } b--black-05`}
            >
              <div
                className={`mr1 ${
                  // eslint-disable-next-line no-prototype-builtins
                  allUsers.hasOwnProperty(user._id)
                    ? 'br-100 bg-green'
                    : 'br-100 ba'
                }`}
                style={{ width: '7px', height: '7px' }}
              />
              <h1 className='f7 black mv0'>
                @
                {user.name}
              </h1>
            </article>
          ))
          : ''}
      </div>
    </div>
  );
};
