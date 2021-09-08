import React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';

import { ITaskMember } from 'stores/taskMembers/Reducer';

import { AssignedMemeberListEditor } from './AssignedMemeberListEditor';

interface IAssignedMemberListViewComponentInternalProps {
  taskMemberList: ITaskMember[];
}

export const AssignedMemberListViewComponent = (
  props: IAssignedMemberListViewComponentInternalProps &
    RouteComponentProps,
) => {
  return (
    <div
      className="pv2"
      style={{
        minHeight: '100px',
        maxHeight: '550px',
        overflowY: 'auto',
      }}
    >
      {props.taskMemberList.map((list) => (
        <div className="flex mb1">
          <img
            className="h3 w3"
            src={
              list.profileImage
                ? list.profileImage
                : 'https://tigrowresources.s3-ap-southeast-1.amazonaws.com/profilePhoto.svg'
            }
            alt=""
          />
          <div
            className="flex w-100 justify-between bb pr3 ml3"
            style={{
              borderBottom: '1px solid #EEEEEF',
              paddingTop: '20px',
            }}
          >
            <div>
              <p className="b ma0">{list.name}</p>
              <p className="ma0">added by {list.account}</p>
            </div>
            <div>
              <AssignedMemeberListEditor assignMemberId={list._id} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    taskMemberList:
      state.taskIndexReducer.taskMembersReducer.taskMemberList,
  };
};

export const AssignedMemberListView = connect(mapStateToProps)(
  withRouter(AssignedMemberListViewComponent),
);
