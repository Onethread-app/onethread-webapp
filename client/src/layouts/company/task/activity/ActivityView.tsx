import React, { useState, useEffect } from 'react';
import { ActivityEditor } from './ActivityEditor';
import userIcon from './../../../../resources/images/profilePhoto.svg';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { getAllComments } from 'stores/comment/Actions';
import { Loading } from 'components/Loading';
import { Icomment } from 'stores/comment/Reducer';
import moment from 'moment';
import { isMobileOnly } from 'react-device-detect';

interface IActivityViewInternalProps {
  commentList: Icomment[];
  getAllComments: () => void;
  currentTaskId: string;
}

export const ActivityViewPageComponent = (
  props: IActivityViewInternalProps & RouteComponentProps,
) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getCommentsApi() {
      await props.getAllComments();
      setLoading(false);
    }
    getCommentsApi();
  }, [props.currentTaskId]);

  return (
    <div className="flex flex-column h-100 pl2 mb5 mb0-ns">
      <div className="pl3">
        <h1 className="f5 fw7 lh-title black">Activity</h1>
      </div>

      <div
        className={`flex flex-column flex-grow-1 overflow-y-auto pt2 ${
          !isMobileOnly ? 'bl b--tigrowLightGray-1 pl3' : ''
        } `}
      >
        {loading === false ? (
          props.commentList.map((comment) => (
            <div className="flex justify-between">
              <article className="dt pb2 mt2 w-100">
                <div className="dtc w2">
                  <img
                    src={
                      comment.profileImage
                        ? comment.profileImage
                        : userIcon
                    }
                    className="ba b--black-10 db br-100 w2 h2"
                    alt=""
                  />
                </div>
                <div className="dtc v-mid pl3">
                  <div className="flex">
                    <h1 className="f6 fw6 lh-title black mv0">
                      {comment.name}
                    </h1>
                    {/* <p
                      className="f7 fw6 lh-title silver mv0 pl2 i"
                      style={{ paddingTop: '2px' }}
                    >
                      {comment.position}
                    </p> */}
                  </div>
                  <p className="pt1" style={{ fontSize: '9px' }}>
                    {moment(comment.createdAt).format('lll')}
                  </p>
                  <p
                    className="pa2 br3 mt2 ws-break"
                    style={{
                      backgroundColor: '#F4FBFB',
                    }}
                  >
                    {comment.text}
                  </p>
                </div>
              </article>
              {/* <div>
                                    <Icon className="fr mv3 tigrow-lightBlue pointer mr4"
                                        icon="comment"
                                    />
                                </div> */}
              {/* <CommentReply /> */}
            </div>
          ))
        ) : (
          <Loading />
        )}
      </div>
      <ActivityEditor />
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentTaskId:
      state.boardIndexReducer.boardReducer.currentTask._id,
    commentList: state.boardIndexReducer.commentReducer.commentList,
  };
};

export const ActivityView = connect(mapStateToProps, {
  getAllComments,
})(withRouter(ActivityViewPageComponent));
