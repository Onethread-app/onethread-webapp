import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@blueprintjs/core/lib/esm/components/dialog/dialog';

import addSubtask from 'resources/images/clipboard.png';

import { SubTaskCreator } from './SubTaskEditor';

const AddSubTaskButton = () => {
  const { t } = useTranslation();
  const [subtask, setsubtask] = useState(Object);
  const [showSubtaskForm, setShowSubTaskForm] = useState(false);

  return (
    <div>
      {showSubtaskForm && (
        <Dialog
          isOpen={showSubtaskForm}
          onClose={() => setShowSubTaskForm(!showSubtaskForm)}
          canEscapeKeyClose
          canOutsideClickClose
          style={{
            background: '#fff',
          }}
        >
          <SubTaskCreator
            showSubtaskForm={showSubtaskForm}
            subtask={subtask}
            setsubtask={setsubtask}
            setShowSubTaskForm={(e) => setShowSubTaskForm(!showSubtaskForm)}
          />
        </Dialog>
      )}
      <div>
        <div
          onClick={() => setShowSubTaskForm(true)}
          className='flex br2 mb2 pt2 ph3 pointer'
          style={{
            width: '100%',
            color: '#5A5A5A',
            border: '1px solid #B1B1B1',
          }}
          role='button'
          tabIndex={0}
        >
          <img
            style={{ height: '15px' }}
            src={addSubtask}
            alt='addSubtask'
          />
          <p className='pl3 f7'>
            {t('app.project.Project-boards.Add-Subtask')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddSubTaskButton;
