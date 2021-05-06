import React, { Dispatch, SetStateAction } from 'react';
import { connect } from 'react-redux';
import { Button, FileInput } from '@blueprintjs/core';
import { isEmpty } from 'lodash';

import {
  ITaskFileUpload,
  taskFileUpload,
} from 'stores/board/Actions';
import { ITask } from 'stores/board/Reducer';

interface ITaskFilesAttachProps {
  setFilePopover: Dispatch<SetStateAction<boolean>>;
}

interface ITaskFilesAttachInternalProps
  extends ITaskFilesAttachProps {
  currentTask: ITask;
  taskFileUpload: (payload: ITaskFileUpload) => void;
  uploadingTaskFile: boolean;
  errorOnUploadingTaskFile: string;
}

const TaskFilesAttach = (props: ITaskFilesAttachInternalProps) => {
  const [imageName, setImageName] = React.useState({}) as any;
  const [imageSelected, setImageSelected] = React.useState({}) as any;
  const [imageError, setImageError] = React.useState('');
  // const [imageLoading, setImageLoading] = useState(false);
  // const [imageError, setImageError] = useState('');

  const sizeLimit = 25;

  const checkMimetype = [
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'application/x-zip-compressed',
    'application/pdf',
    'application/msword',
    'application/json',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-excel',
    'text/plain',
    'text/csv',
    'image/webp',
    'image/apng',
    'image/png',
    'image/bmp',
    'image/gif',
    'image/jpeg',
    'image/jpg',
    'image/svg',
    'image/svg+xml',
    'image/bmp',
    'image/vnd.microsoft.icon',
  ];

  const imageChangeHandler = (event: any) => {
    if (event.target.files[0]) {
      const file = event.target.files[0];
      if (file) {
        if (!checkMimetype.includes(file.type)) {
          setImageName('');
          setImageError('This file format is not supported');
          return false;
        } else if (file.size / 1024 / 1024 > sizeLimit) {
          setImageName('');
          setImageError(
            `File size can't be greater than ${sizeLimit} MB`,
          );
          return false;
        } else {
          const data = new FormData();
          data.append('file', file, file.name);
          data.append('taskId', props.currentTask._id);
          setImageName(file);
          setImageSelected(data);
          setImageError('');
          return data;
        }
      }
    }
    return false;
  };

  const handleSubmit = async (e: any) => {
    const payload = {
      file: imageSelected,
      columnId: props.currentTask.columnId,
      taskId: props.currentTask._id,
    };
    await props.taskFileUpload(payload);

    if (
      props.uploadingTaskFile === false &&
      props.errorOnUploadingTaskFile === ''
    ) {
      props.setFilePopover(false);
    }
  };

  return (
    <div className="pa3 cf bg-white">
      <h1 className="f5">Attach Files</h1>
      <FileInput
        text={imageName.name ? imageName.name : 'Choose file...'}
        onInputChange={(e) => imageChangeHandler(e)}
      />
      {imageError && (
        <small style={{ color: 'red' }}>{imageError}</small>
      )}
      <div>
        <Button
          type="submit"
          text="Attach"
          className="grow h2 pointer w-40 fr mt2"
          style={{
            background: '#0fa3a3',
            outline: 'none',
            color: 'white',
            boxShadow: 'none',
          }}
          loading={props.uploadingTaskFile}
          disabled={
            props.uploadingTaskFile === true ||
            isEmpty(imageName.name)
              ? true
              : false
          }
          onClick={(e: any) => handleSubmit(e)}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentTask: state.boardIndexReducer.boardReducer.currentTask,
    uploadingTaskFile:
      state.boardIndexReducer.boardReducer.uploadingTaskFile,
    errorOnUploadingTaskFile:
      state.boardIndexReducer.boardReducer.errorOnUploadingTaskFile,
  };
};

export default connect(mapStateToProps, { taskFileUpload })(
  TaskFilesAttach,
);
