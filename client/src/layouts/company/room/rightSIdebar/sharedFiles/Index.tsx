import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { IRoomReducer } from 'stores/room/Reducer';
import { SharedFileItem } from './SharedFileItem';

interface SharedFileComponentProps {
  sharedFileMessages?: IRoomReducer['sharedFileMessages'];
}

const SharedFileComponent = (props: SharedFileComponentProps) => {

  const { t } = useTranslation();

  return (
    <div
      className="flex flex-column pb2"
      style={{
        maxHeight: '50%',
      }}
    >
      <h3 className="mv2 f6 f5-ns">{t('app.project.Project-preface.Media')}</h3>
      {/* <h3 className="mv2 f6 f5-ns">Shared Files</h3> */}
      <div className="overflow-y-auto flex-grow-1">
        {props.sharedFileMessages &&
        props.sharedFileMessages.length > 0 ? (
          props.sharedFileMessages.map((sharedFileMessage) => {
            return sharedFileMessage.files.map((file) => {
              return <SharedFileItem key={file._id} file={file} />;
            });
          })
        ) : (
          <h4 className="mv0 gray f5-ns f7">No files.</h4>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    sharedFileMessages: state.roomReducer.sharedFileMessages,
  };
};

export const SharedFile = connect(
  mapStateToProps,
  null,
)(SharedFileComponent);
