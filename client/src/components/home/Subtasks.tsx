import React from 'react';
import { useTranslation } from 'react-i18next';
import { tigrowApi } from 'config';

import CircularProgress from '@material-ui/core/CircularProgress/CircularProgress';

import { tokenConfig } from 'stores/UtilsActions';
import { sortTasksByDueDate } from 'helpers/utils';

import SubtaskItem from 'components/subtask/SubtaskItem';

const Subtasks = () => {
  const { t } = useTranslation();
  const [subTasks, setSubtasks] = React.useState<any>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const getUsersSubtasks = async () => {
      const headers = tokenConfig();
      if ((headers.headers as any).Authorization) {
        const response = await tigrowApi.get(
          `accounts/subtasks`,
          headers,
        );
        setSubtasks(response.data);
        setLoading(false);
      }
    };
    getUsersSubtasks();
  }, []);

  return (
    <div className="subtasks">
      <h3>{t('app.project.Tasks.Subtasks')}</h3>
      {loading ? (
        <div
          style={{ minHeight: '200px', width: '100%' }}
          className="flex items-center justify-center"
        >
          <CircularProgress
            style={{ color: 'rgb(48, 48, 83)' }}
            size={30}
          />
        </div>
      ) : (
        <div className="subtasks-list mt2 pa1">
          <div
            className="flex items-center justify-between mb2 f5 bb relative"
            style={{ minWidth: '500px' }}
          >
            <div>{t('app.project.Tasks.Subtasks')}</div>
            <div className="flex items-center">
              <div className="mr3" style={{ maxWidth: '100px' }}>
                {t('app.project.Tasks.Tasks')}
              </div>
              <div
                className="flex justify-end mr3"
                style={{ width: '100px' }}
              >
                {t('app.project.Tasks.Due-date')}
              </div>
            </div>
          </div>
          {subTasks.length > 0 ? (
            sortTasksByDueDate(subTasks, 'desc').map(
              (subtask, index) => {
                return (
                  <SubtaskItem
                    subtask={subtask}
                    index={index}
                    key={subtask._id}
                  />
                );
              },
            )
          ) : (
            <div className="w-100 tc" style={{ color: '#777' }}>
              No Subtasks due
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Subtasks;
