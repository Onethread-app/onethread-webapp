import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import _ from 'lodash';

import { getAllMembers } from 'stores/taskMembers/Action';

import { Loading } from 'components/Loading';
import { AssignedMemeberListEditor } from './AssignedMemeberListEditor';
import { ITask } from 'stores/task/Reducer';

interface IAssignedMembersViewComponentInternalProps {
  currentTask: ITask;
}

export const AssignedMembersViewComponent = (
  props: IAssignedMembersViewComponentInternalProps &
    RouteComponentProps,
) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [memberList, setMemberList] = useState<any>([]);
  useEffect(() => {
    setLoading(true);
    if (props.currentTask.members?.length > 0) {
      const subtaskMembers = props.currentTask.subTasks.map(
        (subtask) => subtask.members || [],
      );
      let data =
        _.uniqBy(
          [...props.currentTask.members, ...subtaskMembers.flat()],
          'assignedPerson._id',
        ) || [];
      setMemberList(data);
    }
    setLoading(false);
  }, [props.currentTask]);
  return (
    <>
      {loading === false ? (
        <div>
          <h3> {t('app.project.Tasks.Viewers')}</h3>
          {memberList.map((list) => (
            <div
              className="pa1 flex items-center w-100"
              key={list._id}
            >
              <div className="flex items-center w-100">
                <img
                  src={
                    list?.assignedPerson?.profileImage
                      ? list.assignedPerson.profileImage
                      : 'https://tigrowresources.s3-ap-southeast-1.amazonaws.com/profilePhoto.svg'
                  }
                  className="br2 h2 w2 pointer mh2"
                  alt="avatar"
                />
                <p className="capitalize">{`${list?.assignedPerson?.firstName} ${list?.assignedPerson?.lastName}`}</p>
              </div>
              <AssignedMemeberListEditor
                assignMemberId={list?._id}
                task={props.currentTask}
              />
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
      state.taskIndexReducer.taskMembersReducer.taskMemberList,
    currentTask: state.taskIndexReducer.taskReducer.currentTask,
  };
};

export default connect(mapStateToProps, {
  getAllMembers,
})(withRouter(AssignedMembersViewComponent));
