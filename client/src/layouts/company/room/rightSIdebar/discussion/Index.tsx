import React from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { IRoomReducer } from 'stores/room/Reducer';

interface DiscussionComponentProps {
  discussions?: IRoomReducer['discussions'];
}

const DiscussionComponent = (props: DiscussionComponentProps) => {

  const { t } = useTranslation();

  return (
    <div
      className="flex flex-column pb2"
      style={{
        maxHeight: '50%',
      }}
    >
      <h3 className="mv2 f6 f5-ns">{t('app.project.Project-rooms.Highlighted-Discussions')}</h3>
      {/* <h3 className="mv2 f6 f5-ns">Highlighted Discussions</h3> */}
      <div className="overflow-y-auto flex-grow-1 pr3">
        {props.discussions && props.discussions.length > 0 ? (
          props.discussions.map((d) => (
            <li
              key={d._id}
              className="bg-black-05 pv2 ph3"
              style={{ borderRadius: '8px' }}
            >
              {`${d.text}`}
            </li>
          ))
        ) : (
          <h4 className="mv0 gray f7 f5-ns">{t('app.project.Project-rooms.No-discussions')}</h4>
          // <h4 className="mv0 gray f7 f5-ns">No discussions.</h4>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    discussions: state.roomReducer.discussions,
  };
};

export const Discussion = connect(
  mapStateToProps,
  null,
)(DiscussionComponent);
