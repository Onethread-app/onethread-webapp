import React, { Dispatch, SetStateAction } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { Button, FileInput, Icon } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';

import {
  ITaskFileUpload,
  taskFileUpload,
} from 'stores/board/Actions';
import { ITask } from 'stores/board/Reducer';
import { useTranslation } from 'react-i18next';

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
  const [fileLoading, setFileLoading] = React.useState(false);
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
    setFileLoading(true);
  };

  React.useEffect(() => {
    if (
      fileLoading &&
      props.uploadingTaskFile === false &&
      props.errorOnUploadingTaskFile === ''
    ) {
      setFileLoading(false);
      props.setFilePopover(false);
    }
  }, [props.uploadingTaskFile, props.errorOnUploadingTaskFile]);

  const { t } = useTranslation();

  return (
    <div className="pa3 cf bg-white flex flex-column">
      <div className="flex justify-end">
        <Icon
          icon={IconNames.CROSS}
          iconSize={20}
          className="grow pointer"
          onClick={(e: any) => props.setFilePopover(false)}
        />
      </div>
      <h1 className="f5">{t('app.project.Project-boards.Attach-Files')}</h1>
      {/* <h1 className="f5">Attach Files</h1> */}
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
