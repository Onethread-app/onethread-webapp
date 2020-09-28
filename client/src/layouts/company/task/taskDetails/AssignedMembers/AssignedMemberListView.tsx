import React from 'react';
import { AssignedMemeberListEditor } from './AssignedMemeberListEditor';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { ITaskMember } from 'stores/taskMembers/Reducer';

interface IAssignedMemberListViewComponentInternalProps {
  taskMemberList: ITaskMember[];
  role: string;
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
      {props.taskMemberList && props.taskMemberList.map((list) => (
        <div className="flex mb1">
          <img
            className="h3 w3"
            src={
              list.profileImage
                ? list.profileImage
                : 'https://tigrowresources.s3-ap-southeast-1.amazonaws.com/profilePhoto.svg'
            }
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
            {
              props.role !== 'member' 
                && 
              <div>
                <AssignedMemeberListEditor assignMemberId={list._id} />
              </div>
            }
          </div>
        </div>
      ))}
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    taskMemberList:
      state.boardIndexReducer.taskMembersReducer.taskMemberList,
    role:
      state.projectReducer.projectRole.projects &&
      state.projectReducer.projectRole.projects.role,
  };
};

export const AssignedMemberListView = connect(mapStateToProps)(
  withRouter(AssignedMemberListViewComponent),
);
