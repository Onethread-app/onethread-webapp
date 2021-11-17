import { Dialog } from '@blueprintjs/core';
import { FileUpload } from 'layouts/company/room/chatLayout/messages/fileUpload';
import { useEffect, useRef, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { sendRoomMessage } from 'stores/room/Actions';
import { TOGGLE_EMOJI_PICKER } from 'stores/room/Types';
import ReactDOM from 'react-dom';
import { MentionData } from '@draft-js-plugins/mention';
import {
  IRoomPendingFile,
  IRoomReducer,
  ITypingUsers,
} from 'stores/room/Reducer';
import { User } from 'stores/user/Reducer';
import { capitalizeFirstLetter } from 'helpers/utils';
import MessageInput from './MessageInput';
interface Props {
  sendRoomMessage: (data: {
    text: string;
    room: string;
    files: any[];
    type?: string;
  }) => void;
  profileImage: any;
  emojiPicker: boolean;
  pendingFiles: IRoomPendingFile[];
  typingUsers: ITypingUsers[];
  user: User;
  roomUsers: IRoomReducer['users'];
  uploadingFile: boolean;
  errorOnFileUpload: string;
  currentRoom: IRoomReducer['currentRoom'];
}

const CommentBox = (props: Props) => {
  const dispatch = useDispatch();
  const [showFileDialog, setShowFileDialog] =
    useState<boolean>(false);
  const emojiRef = useRef<any>(null);
  const [mentions, setMentions] = useState<MentionData[]>([
    {
      name: '',
      title: '',
      avatar: '',
    },
  ]);

  const toggleEmojiPicker = () => {
    dispatch({
      type: TOGGLE_EMOJI_PICKER,
      payload: !props.emojiPicker,
    });
  };

  const checkClickOutside = (e: any) => {
    const node = ReactDOM.findDOMNode(emojiRef.current);
    if (node && !node.contains(e.target)) {
      toggleEmojiPicker();
    }
  };

  useEffect(() => {
    if (props.roomUsers.length > 0) {
      const m = props.roomUsers.map((user) => {
        const cF = capitalizeFirstLetter(user.firstName);
        const cL = capitalizeFirstLetter(user.lastName);
        return {
          name: `${cF} ${cL}`,
          title: user.name,
          avatar: user.profileImage
            ? user.profileImage
            : 'https://pbs.twimg.com/profile_images/517863945/mattsailing_400x400.jpg',
        };
      });
      setMentions(m);
    }
  }, [props.roomUsers]);

  useEffect(() => {
    document.addEventListener('click', checkClickOutside);
    return () => {
      document.removeEventListener('click', checkClickOutside);
    };
  });

  return (
    <>
      {mentions[0].name && (
        <MessageInput
          setShowFileDialog={setShowFileDialog}
          mentions={mentions}
        />
      )}

      {showFileDialog && (
        <Dialog
          icon="briefcase"
          onClose={() => setShowFileDialog(!showFileDialog)}
          isOpen
          style={{ background: '#fff' }}
        >
          <FileUpload
            setShowDialog={setShowFileDialog}
            roomID={props.currentRoom?._id}
          />
        </Dialog>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => ({
  profileImage: state.userReducer.user.profileImage,
  emojiPicker: state.roomReducer.emojiPicker,
  typingUsers: state.roomReducer.typing.users,
  pendingFiles: state.roomReducer.pendingFiles,
  uploadingFile: state.roomReducer.uploadingFile,
  errorOnFileUpload: state.roomReducer.errorOnFileUpload,
  roomUsers: state.roomReducer.users,
  user: state.userReducer.user,
  currentRoom: state.roomReducer.currentRoom,
});

export default connect(mapStateToProps, { sendRoomMessage })(
  CommentBox,
);
