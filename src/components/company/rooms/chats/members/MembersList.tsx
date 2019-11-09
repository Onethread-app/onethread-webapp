import React from 'react'
interface MembersListProps {
  users: []
}
const MembersList = (props: MembersListProps) => {
  return (
    <div className="ph3">
      {props.users.length ? props.users.map((user: { id: string, name: string, presence: { state: string } }, i: number) => {
        return (
          <article key={user.id} className={`w-100 ${i !== props.users.length - 1 ? "bb" : ""} b--black-05 pb2 mt2`}>
            <h1 className="f6 f5-ns fw6 lh-title black mv0">@{user.name}</h1><small>{user.presence}</small>
          </article>
        );
      }) : ""}
    </div>
  )
}

export default MembersList;
