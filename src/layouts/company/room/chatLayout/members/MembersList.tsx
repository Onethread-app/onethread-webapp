import React from 'react';
import { isEqual } from 'lodash';
import { IRoomMember } from 'stores/room/Reducer';
interface MembersListProps {
  users: IRoomMember[];
}
export const MembersList = (props: MembersListProps) => {
  return (
    <div className="pa3">
      <h1 className="f4 tigrow-lightBlue">Room members</h1>
      <div className="">
        {props.users.length ?
          props.users.map((user, i: number) => {
            return (
              <article
                key={user._id}
                className={`flex items-center w-100 pv1 ${i !== props.users.length - 1 ? 'bb' : ''} b--black-05`}>
                <div
                  className={`mr1 ${isEqual(user.presence, 'online') ?
                    'br-100 bg-green' : 'br-100 ba'}`}
                  style={{ width: '7px', height: '7px' }}></div>
                <h1 className="f7 black mv0">@{user.name}</h1>
              </article>
            );
          }) : ''}
      </div>
    </div>
  );
};
