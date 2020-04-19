import React, { useState, useEffect } from 'react';
import { Dialog } from '@blueprintjs/core';
import { AssignedMemberListView } from './AssignedMemberListView';
import { connect } from 'react-redux';
import { getAllMembers } from 'stores/taskMembers/Action';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Loading } from 'components/Loading';
import { ITaskMember } from 'stores/taskMembers/Reducer';

interface IAssignedMembersViewComponentInternalProps {
  getAllMembers: () => void;
  taskMemberList: ITaskMember[];
}

export const AssignedMembersViewComponent = (
  props: IAssignedMembersViewComponentInternalProps &
    RouteComponentProps,
) => {
  const [showMemberlist, setShowMemberList] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getAllTaskMembers() {
      await props.getAllMembers();
      setLoading(false);
    }
    getAllTaskMembers();
  }, []);

  return (
    <>
      {loading === false ? (
        <div className="flex">
          {props.taskMemberList.slice(0, 3).map((list) => (
            <div className="pa1 dib">
              <img
                src={
                  list.profileImage
                    ? list.profileImage
                    : 'http://tachyons.io/img/logo.jpg'
                }
                className="br2 h2 w2 pointer"
                alt="avatar"
                onClick={() => setShowMemberList(true)}
              />
            </div>
          ))}
          {props.taskMemberList.length > 3 && (
            <div className="pa1 dib">
              <p
                className="br2 h2 w2 pa2 pointer"
                onClick={() => setShowMemberList(true)}
              >
                +{props.taskMemberList.length - 3}
              </p>
            </div>
          )}
        </div>
      ) : (
        <Loading />
      )}
      {showMemberlist && (
        <Dialog
          title="Members List"
          onClose={() => setShowMemberList(!showMemberlist)}
          isOpen={showMemberlist}
          style={{
            background: '#fff',
          }}
          className="pa3"
        >
          <AssignedMemberListView />
        </Dialog>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    taskMemberList:
      state.boardIndexReducer.taskMembersReducer.taskMemberList,
  };
};

export const AssignedMembersView = connect(mapStateToProps, {
  getAllMembers,
})(withRouter(AssignedMembersViewComponent));
