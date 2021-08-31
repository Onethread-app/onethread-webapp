import React from 'react';

import SubtaskItem from 'components/subtask/SubtaskItem';

import { tigrowApi } from 'config';
import { tokenConfig } from 'stores/UtilsActions';
import { sortTasksByDueDate } from 'helpers/utils';
import { useTranslation } from 'react-i18next';

const Subtasks = () => {
  const { t } = useTranslation();
  const [subTasks, setSubtasks] = React.useState<any>([]);

  React.useEffect(() => {
    const getUsersSubtasks = async () => {
      const headers = tokenConfig();
      if ((headers.headers as any).Authorization) {
        const response = await tigrowApi.get(
          `accounts/subtasks`,
          headers,
        );
        setSubtasks(response.data);
      }
    };
    getUsersSubtasks();
  }, []);

  return (
    <div className="subtasks">
      <h3>{t('app.project.Tasks.Subtasks')}</h3>
      {/* <h3>Subtasks</h3> */}
      <div className="subtasks-list mt2 pa1">
        <div
          className="flex items-center justify-between mb2 f5 bb"
          style={{ minWidth: '500px' }}
        >
          <div>{t('app.project.Tasks.Subtasks')}</div>
          {/* <div>Name</div> */}
          <div className="flex items-center">
            <div className="mr3" style={{ maxWidth: '100px' }}>
              {t('app.project.Tasks.Tasks')}
              {/* Task */}
            </div>
            <div
              className="flex justify-end mr3"
              style={{ width: '100px' }}
            >
              {t('app.project.Tasks.Due-date')}
              {/* Deadline */}
            </div>
          </div>
        </div>
        {sortTasksByDueDate(subTasks, 'desc').map(
          (subtask, index) => {
            return (
              <SubtaskItem
                subtask={subtask}
                index={index}
                key={subtask._id}
              />
            );
          },
        )}
      </div>
    </div>
  );
};

export default Subtasks;
