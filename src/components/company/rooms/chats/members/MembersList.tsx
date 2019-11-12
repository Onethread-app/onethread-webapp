import React from 'react'
interface MembersListProps {
  users: [];
}
const MembersList = (props: MembersListProps) => {
  return (
    <div className="">
      <h1 className="f5 lh-title tigrow-lightBlue pa3 pt2 ma0 shadow-1">Room members</h1>
      <div className="ph3">
        {props.users.length ? props.users.map((user: { id: string, name: string, presence: { state: string } }, i: number) => {
          return (
            <article key={user.id} className={`w-100 pv1 ${i !== props.users.length - 1 ? "bb" : ""} b--black-05`}>
              <h1 className="f7 black mv0">@{user.name}   {user.presence}</h1>
            </article>
          );
        }) : ""}
      </div>
    </div>
  )
}

export default MembersList;
