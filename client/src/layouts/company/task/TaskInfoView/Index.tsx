import React, { useState } from 'react';
import { Popover } from '@blueprintjs/core';
import { DueDateEditor } from '../taskDetails/DueDate/DueDateEditor';
import { useTranslation } from 'react-i18next';
import { AssignedMembersEditor } from '../taskDetails/AssignedMembers/AssignedMembersEditor';
import addMembers from 'resources/images/addMembers.png';
import { AssignedMembersView } from '../taskDetails/AssignedMembers/AssignedMembersView';
import { PriorityEditorList } from '../taskDetails/Priority/PriorityEditorList';
import { TaskStatusEdior } from '../TaskStatusEditor/TaskStatusEdior';

const TaskInfoViewComponent = () => {
  const { t } = useTranslation();
  const [membersPopover, setMembersPopover] = useState(false);

  return (
    <div className="w-100">
      <h3 style={{ fontWeight: 700, lineHeight: '28px' }}>
        {t('app.project.Tasks.Task-Details')}:
      </h3>
      <div className="mt3">
        <div className="mb2">
          <TaskStatusEdior />
        </div>
        <div className="task-info-items">
          <h1 className="f6">
            {t('app.project.Tasks.Assigned-To')}:
          </h1>
          <Popover
            isOpen={membersPopover}
            content={
              <div className="pa3 cf bg-white">
                <AssignedMembersEditor
                  setMembersPopover={setMembersPopover}
                />
              </div>
            }
            target={
              <div
                className="flex br2 mb2 pt2 ph3 pointer"
                style={{
                  width: '100%',
                  minWidth: '11rem',
                  color: '#5A5A5A',
                  border: '1px solid #B1B1B1',
                }}
                onClick={() => setMembersPopover(!membersPopover)}
              >
                <img
                  style={{ height: '15px' }}
                  src={addMembers}
                  alt="addMembers"
                />
                <p className="pl3 f7">
                  {t('app.project.Project-boards.Members')}
                </p>
              </div>
            }
          />
        </div>
        <DueDateEditor />
        <PriorityEditorList />
        <div className="mt4">
          <AssignedMembersView />
        </div>
      </div>
    </div>
  );
};

export default TaskInfoViewComponent;
