import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { IconNames } from '@blueprintjs/icons';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { Popover } from '@blueprintjs/core/lib/esm/components/popover/popover';
import { Tooltip } from '@blueprintjs/core/lib/esm/components/tooltip/tooltip';

import { IFile } from 'stores/task/Reducer';
import { taskFileDelete, ITaskFileDelete } from 'stores/task/Actions';

import TaskFilesAttach from './TaskFilesAttach';

interface ITaskFiles {
  taskFiles: IFile[];
  taskId: string;
  columnId: string;
  taskFileDelete: ({
    fileId,
    columnId,
    taskId,
  }: ITaskFileDelete) => void;
}

const TaskFiles = (props: ITaskFiles) => {
  const { t } = useTranslation();
  const [filePopover, setFilePopover] = useState(false);

  const [showDelete, setShowDelete] = useState({
    value: false,
    _id: '',
  });

  const handleDelete = (fileId) => {
    const payload = {
      fileId,
      taskId: props.taskId,
      columnId: props.columnId,
    };
    props.taskFileDelete(payload);
  };

  return (
    <div className="w-100">
      <div className="flex justify-between items-center w-100">
        <h1
          style={{
            color: '#323030',
            fontSize: '18px',
            fontWeight: 700,
            width: '100%',
          }}
        >
          {t('app.project.Project-preface.Media')} (
          {props.taskFiles && props.taskFiles!.length!})
        </h1>
        <div>
          <Popover
            isOpen={filePopover}
            content={
              <TaskFilesAttach setFilePopover={setFilePopover} />
            }
            target={
              <Icon
                style={{
                  color: '#323030',
                }}
                icon={IconNames.PLUS}
                iconSize={20}
                className="pointer"
                onClick={() => setFilePopover(!filePopover)}
              />
            }
          />
        </div>
      </div>
      <div
        style={{
          maxHeight: '160px',
          overflowY: 'auto',
        }}
      >
        {props.taskFiles && props.taskFiles.length ? (
          props.taskFiles.map((file) => (
            <div
              key={file._id}
              className="flex items-center justify-between pr2"
              onMouseEnter={() =>
                setShowDelete({ value: true, _id: file._id })
              }
              onMouseLeave={() =>
                setShowDelete({ value: false, _id: '' })
              }
            >
              <h1
                className="f6 fw4 w-80"
                style={{
                  wordBreak: 'break-word',
                  wordWrap: 'break-word',
                }}
              >
                {file.s3Key.split('/')[1]}
              </h1>
              <div className="flex items-center justify-center">
                {showDelete.value && showDelete._id === file._id && (
                  <Tooltip content="Delete" intent="danger">
                    <Icon
                      icon="cross"
                      className="blue pointer mr2"
                      iconSize={14}
                      onClick={() => {
                        handleDelete(file._id);
                      }}
                    />
                  </Tooltip>
                )}
                <Tooltip content="Download" intent="primary">
                  <a
                    href={file.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    <Icon icon="import" className="" iconSize={14} />
                  </a>
                </Tooltip>
              </div>
            </div>
          ))
        ) : (
          <h1 className="f6">{t('app.project.Tasks.No-Files')}</h1>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    taskFiles: state.taskIndexReducer.taskReducer.currentTask.file,
    taskId: state.taskIndexReducer.taskReducer.currentTask._id,
    columnId: state.taskIndexReducer.taskReducer.currentTask.columnId,
  };
};

export default connect(mapStateToProps, {
  taskFileDelete,
})(TaskFiles);
