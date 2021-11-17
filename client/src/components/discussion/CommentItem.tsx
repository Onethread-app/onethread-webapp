import { connect } from 'react-redux';
import moment from 'moment';

import { toggleDiscussionRoom } from 'stores/room/Actions';

import { StyledAvatar } from './DiscussionThread';
import {
  CommentDiv,
  Commenter,
  FilesDiv,
} from './ProjectDiscussion.styles';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { SharedFileItem } from './SharedFile/ShareFileItem';

interface Props {
  message: any;
  toggleDiscussionRoom: (
    data: { discussion: boolean },
    messageId: string,
  ) => void;
  currentUser: boolean;
}

const CommentItem = (props: Props) => {
  const { message, currentUser, toggleDiscussionRoom } = props;
  const isBeforeToday = moment(message.createdAt).isBefore(
    new Date(),
    'day',
  );
  return (
    <>
      <Commenter rightJustify={currentUser}>
        {!currentUser ? (
          <StyledAvatar
            name={message.account.firstName.substring(0, 2)}
            profilePic={message.account.profileImage}
          ></StyledAvatar>
        ) : null}
        {currentUser ? (
          <span className="ml2">You</span>
        ) : (
          <span className="capitalize ml2">
            {message.account.firstName}
          </span>
        )}
        <span className="tigrow-darkGray ml2 mr2 f7">
          {isBeforeToday === true
            ? moment(message.createdAt).format('h:m a')
            : moment(message.createdAt).fromNow()}
        </span>
        {currentUser ? (
          <StyledAvatar
            name={message.account.firstName.substring(0, 2)}
            profilePic={message.account.profileImage}
          ></StyledAvatar>
        ) : null}
      </Commenter>
      {message.text ? (
        <CommentDiv rightJustify={currentUser}>
          {!currentUser ? (
            <div className="flex flex-column">
              <span className="comment">{message.text}</span>
            </div>
          ) : null}
          {message.discussion && message.type !== 'file' ? (
            <StarIcon
              style={{ color: 'gold' }}
              onClick={() => {
                toggleDiscussionRoom(
                  {
                    discussion: !message.discussion,
                  },
                  message._id,
                );
              }}
            />
          ) : (
            <StarBorderIcon
              onClick={() => {
                toggleDiscussionRoom(
                  {
                    discussion: !message.discussion,
                  },
                  message._id,
                );
              }}
              className="is-favourite"
            />
          )}
          {currentUser ? (
            <div className="flex flex-column">
              <span className="comment">{message.text}</span>
            </div>
          ) : null}
        </CommentDiv>
      ) : null}
      {message.files.length > 0 ? (
        <FilesDiv rightJustify={currentUser}>
          {message.files.map((file: any) => (
            <SharedFileItem file={file} />
          ))}
        </FilesDiv>
      ) : null}
    </>
  );
};

const mapStateToProps = (state: any) => ({});

export default connect(mapStateToProps, { toggleDiscussionRoom })(
  CommentItem,
);
