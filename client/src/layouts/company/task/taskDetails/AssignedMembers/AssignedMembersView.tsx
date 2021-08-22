import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getAllMembers } from 'stores/taskMembers/Action';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Loading } from 'components/Loading';
import { ITaskMember } from 'stores/taskMembers/Reducer';
import { AssignedMemeberListEditor } from './AssignedMemeberListEditor';
import { useTranslation } from 'react-i18next';

interface IAssignedMembersViewComponentInternalProps {
  getAllMembers: () => void;
  taskMemberList: ITaskMember[];
  currentTaskId: string;
}

export const AssignedMembersViewComponent = (
  props: IAssignedMembersViewComponentInternalProps &
    RouteComponentProps,
) => {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    async function getAllTaskMembers() {
      await props.getAllMembers();
      setLoading(false);
    }
    getAllTaskMembers();
  }, [props.currentTaskId]);
  return (
    <>
      {loading === false ? (
        <div>
          <h3> {t('app.project.Tasks.Viewers')}</h3>
          {props.taskMemberList.map((list) => (
            <div
              className="pa1 flex items-center w-100"
              key={list._id}
            >
              <div className="flex items-center w-100">
                <img
                  src={
                    list.profileImage
                      ? list.profileImage
                      : 'https://tigrowresources.s3-ap-southeast-1.amazonaws.com/profilePhoto.svg'
                  }
                  className="br2 h2 w2 pointer mh2"
                  alt="avatar"
                />
                <p>{list.name}</p>
              </div>
              <AssignedMemeberListEditor assignMemberId={list._id} />
            </div>
          ))}
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    taskMemberList:
      state.boardIndexReducer.taskMembersReducer.taskMemberList,
    currentTaskId:
      state.boardIndexReducer.boardReducer.currentTask._id,
  };
};

export const AssignedMembersView = connect(mapStateToProps, {
  getAllMembers,
})(withRouter(AssignedMembersViewComponent));
