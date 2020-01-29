import React from 'react';
import { AssignedMemeberListEditor } from './AssignedMemeberListEditor';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { ITaskMember } from 'stores/taskMembers/Reducer';

interface IAssignedMemberListViewComponentInternalProps {
  taskMemberList: ITaskMember[];
}

export const AssignedMemberListViewComponent = (props: IAssignedMemberListViewComponentInternalProps
  & RouteComponentProps) => {

  return (
    <div className="pv2" style={{
      minHeight: '100px',
      maxHeight: '550px',
      overflowY: 'auto',
    }}>

      {
      
        props.taskMemberList.map((list) => (
          <div className="flex">
            <img className="h3" src={list.profileImage ? 
            list.profileImage : 'https://robohash.org/VLSI'} />
            <div className="flex w-100 justify-between pt4 bb pr3 ml3"
              style={{ borderBottom: '1px solid #EEEEEF' }}>
              <div>
                <p className="b ma0">{list.name}</p>
                {/* <p className="ma0">added by xxyy</p> */}
              </div>
              <div>

                <AssignedMemeberListEditor
                assignMemberId={list._id}
                />

              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    taskMemberList: state.boardIndexReducer.taskMembersReducer.taskMemberList
  };
};

export const AssignedMemberListView = connect(mapStateToProps)
  (withRouter(AssignedMemberListViewComponent));
