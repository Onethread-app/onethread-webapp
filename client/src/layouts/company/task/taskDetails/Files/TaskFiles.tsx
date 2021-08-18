import React, { useState } from 'react';
import { connect } from 'react-redux';
import { IFile } from 'stores/board/Reducer';
import {
  taskFileDelete,
  ITaskFileDelete,
} from 'stores/board/Actions';
import TaskFilesAttach from './TaskFilesAttach';
import { Icon, Tooltip } from '@blueprintjs/core';
import { Popover } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import { useTranslation } from 'react-i18next';

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
  const [showDelete, setShowDelete] = React.useState({
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

  const { t } = useTranslation();

  const [filePopover, setFilePopover] = useState(false);

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
    taskFiles: state.boardIndexReducer.boardReducer.currentTask.file,
    taskId: state.boardIndexReducer.boardReducer.currentTask._id,
    columnId:
      state.boardIndexReducer.boardReducer.currentTask.columnId,
  };
};

export default connect(mapStateToProps, {
  taskFileDelete,
})(TaskFiles);
