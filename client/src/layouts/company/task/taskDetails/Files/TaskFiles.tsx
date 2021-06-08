import React from 'react';
import { connect } from 'react-redux';

import { IFile } from 'stores/board/Reducer';
import {
  taskFileDelete,
  ITaskFileDelete,
} from 'stores/board/Actions';
import { Icon, Tooltip } from '@blueprintjs/core';

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

  return (
    <div>
      <h1 className="f6">Shared Files</h1>
      <div style={{ maxHeight: '160px', overflowY: 'scroll' }}>
        {props.taskFiles ? (
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
          <h1>No Files</h1>
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
