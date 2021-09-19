import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';

import { IconNames } from '@blueprintjs/icons';
import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { FileInput } from '@blueprintjs/core/lib/esm/components/forms/fileInput';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';

import { ITask } from 'stores/task/Reducer';
import { ITaskFileUpload, taskFileUpload } from 'stores/task/Actions';

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
  const { t } = useTranslation();
  const sizeLimit = 25;
  const [imageName, setImageName] = useState({}) as any;
  const [imageSelected, setImageSelected] = useState({}) as any;
  const [imageError, setImageError] = useState('');
  const [fileLoading, setFileLoading] = useState(false);
  // const [imageError, setImageError] = useState('');

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

  useEffect(() => {
    if (
      fileLoading &&
      props.uploadingTaskFile === false &&
      props.errorOnUploadingTaskFile === ''
    ) {
      setFileLoading(false);
      props.setFilePopover(false);
    }
  }, [props.uploadingTaskFile, props.errorOnUploadingTaskFile]);

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
      <h1 className="f5">
        {t('app.project.Project-boards.Attach-Files')}
      </h1>
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
            background: '#34b3e9',
            outline: 'none',
            color: 'white',
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
    currentTask: state.taskIndexReducer.taskReducer.currentTask,
    uploadingTaskFile:
      state.taskIndexReducer.taskReducer.uploadingTaskFile,
    errorOnUploadingTaskFile:
      state.taskIndexReducer.taskReducer.errorOnUploadingTaskFile,
  };
};

export default connect(mapStateToProps, { taskFileUpload })(
  TaskFilesAttach,
);
