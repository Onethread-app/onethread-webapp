import React, { useState, useEffect, useRef } from 'react';
import { Button, Dialog } from '@blueprintjs/core';
import { connect, useDispatch } from 'react-redux';
import { trim, isEqual, isEmpty } from 'lodash';
import { sendRoomMessage } from 'stores/room/Actions';
import 'emoji-mart/css/emoji-mart.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  TOGGLE_EMOJI_PICKER,
  CLEAR_FILE_UPLOAD,
  DELETE_ONE_PENDING_FILE,
} from 'stores/room/Types';
import ReactDOM from 'react-dom';
import { Picker } from 'emoji-mart';
import { FileUpload } from './fileUpload';
import {
  IRoomPendingFile,
  IRoomReducer,
  ITypingUsers,
} from 'stores/room/Reducer';
import SmileIcon from './../../../../../resources/images/Emoji.svg';
import SendIcon from './../../../../../resources/images/Send.svg';
import AttachmentIcon from './../../../../../resources/images/attachment.svg';
import {
  isTypingStartTrigger,
  isTypingStopTrigger,
} from '../../channelSubscribe';
import { User } from 'stores/user/Reducer';
import { isMobileOnly } from 'react-device-detect';
import { capitalizeFirstLetter } from 'helpers/utils';

import MessageInput from './MessageInput';
import { MentionData } from '@draft-js-plugins/mention';

interface SendMessageFormProps {
  sendRoomMessage: (data: {
    text: string;
    room: string;
    files: any[];
    type?: string;
  }) => void;
  currentRoom: IRoomReducer['currentRoom'];
  profileImage: any;
  emojiPicker: boolean;
  pendingFiles: IRoomPendingFile[];
  typingUsers: ITypingUsers[];
  user: User;
  roomUsers: IRoomReducer['users'];
}

const SendMessageFormComponent = (props: SendMessageFormProps) => {
  const [text, setText] = useState('');
  const [showFileDialog, setShowFileDialog] = useState(false);
  const [textError, setTextError] = useState('');
  const [mentions, setMentions] = useState<MentionData[]>([
    {
      name: '',
      title: '',
      avatar: '',
    },
  ]);
  const messageLimit = 3500;

  const inputMessageRef = useRef<HTMLTextAreaElement>(null);
  const emojiRef = useRef<any>(null);

  const dispatch = useDispatch();

  // user typing states
  const [typingTimer, setTypingTimer] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingInterval] = useState(1000);

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
    setText('');
    setTextError('');
    setShowFileDialog(false);
    dispatch({ type: CLEAR_FILE_UPLOAD });
  }, [props.currentRoom._id]);

  const resetMessage = (_text: string) => {
    const resetText = _text.replace(/(\r\n|\n|\r)/gm, '');
    setText(resetText);
    return resetText;
  };

  const doneTyping = async () => {
    await isTypingStopTrigger({
      roomId: props.currentRoom._id,
      name: `${props.user.firstName} ${props.user.lastName}`,
      _id: props.user._id,
    });

    setIsTyping(false);
  };

  const onChange = async (e: any) => {
    setText(e.target.value);
    if (!isTyping) {
      await isTypingStartTrigger({
        roomId: props.currentRoom._id,
        name: `${props.user.firstName} ${props.user.lastName}`,
        _id: props.user._id,
      });
    }
    setIsTyping(true);
  };

  const sendMessage = async (_text: string, type: string) => {
    setText('');
    setTextError('');

    const files =
      props.pendingFiles && props.pendingFiles.length
        ? props.pendingFiles.map((file) => ({
            _id: file._id,
            link: file.link,
            s3Key: file.s3Key,
          }))
        : [];

    dispatch({ type: CLEAR_FILE_UPLOAD });
    setText('');

    await props.sendRoomMessage({
      text: _text,
      room: props.currentRoom._id,
      files,
      type,
    });
  };

  const handleMessageSend = () => {
    const trimmedText = trim(text);
    if (
      isEmpty(trimmedText) === false &&
      trimmedText.length <= messageLimit &&
      props.pendingFiles.length > 0
    ) {
      sendMessage(trimmedText, 'attachment');
    } else if (
      isEmpty(trimmedText) === false &&
      trimmedText.length <= messageLimit &&
      props.pendingFiles.length === 0
    ) {
      sendMessage(trimmedText, 'text');
    } else if (
      isEmpty(trimmedText) === true &&
      props.pendingFiles.length > 0
    ) {
      sendMessage(trimmedText, 'file');
    } else if (isEmpty(trimmedText) === true) {
      setTextError('');
      setText(trimmedText);
    } else {
      setTextError(
        `Message should be less than ${messageLimit} character`,
      );
      setText(trimmedText);
    }
  };

  const handleKeyPress = async (e: any) => {
    if (e.key === 'Enter' && e.shiftKey === false) {
      handleMessageSend();
    }
  };

  const toggleEmojiPicker = () => {
    dispatch({
      type: TOGGLE_EMOJI_PICKER,
      payload: !props.emojiPicker,
    });
  };

  const addEmoji = (emoji: any) => {
    const t = `${text} ${emoji.native}`;
    setText(t);
    dispatch({
      type: TOGGLE_EMOJI_PICKER,
      payload: false,
    });
  };

  const checkClickOutside = (e: any) => {
    const node = ReactDOM.findDOMNode(emojiRef.current);
    if (node && !node.contains(e.target)) {
      toggleEmojiPicker();
    }
  };

  useEffect(() => {
    document.addEventListener('click', checkClickOutside);
    return () => {
      document.removeEventListener('click', checkClickOutside);
    };
  });

  return (
    <>
      {/* typing indicator */}
      {props.typingUsers.length
        ? props.typingUsers.map((user, i: number) => {
            if (
              isEmpty(props.currentRoom._id) === false &&
              isEqual(props.currentRoom._id, user.roomId) === true
            ) {
              return (
                <h6 key={i} className="mv1 pl1">
                  {user.name} is typing ...
                </h6>
              );
            }
            return null;
          })
        : ''}

      {/* Emoji picker */}
      {props.emojiPicker ? (
        <Picker
          set="twitter"
          onSelect={addEmoji}
          emoji="sunglasses"
          title="Onethread app"
          autoFocus={true}
          color="#3F61C5"
          ref={emojiRef}
        />
      ) : null}
      <div
        className={`${isMobileOnly && 'fixed bottom-0 bg-white'}`}
        style={{ width: isMobileOnly ? '100%' : '' }}
      >
        {/* pendingFiles */}
        <div className="flex w-100 flex-wrap items-center b--black-10 ba">
          {props.uploadingFile ? (
            <CircularProgress size={25} style={{ margin: '.5rem' }} />
          ) : props.pendingFiles && props.pendingFiles.length ? (
            props.pendingFiles.map((file) => (
              <div className="bg-tigrowLightBlue flex pv2 ph3 ma1 br-pill justify-center items-center">
                <p className="white ma0">
                  {file.s3Key.split('/')[1]}
                </p>
                <span
                  className="bp3-tag-remove bp3-icon-delete mh2 w1 h1"
                  style={{
                    backgroundColor: 'white',
                    color: '#3F61C5',
                    borderRadius: '30px',
                    paddingTop: '1px',
                  }}
                  onClick={() => {
                    dispatch({
                      type: DELETE_ONE_PENDING_FILE,
                      payload: file._id,
                    });
                  }}
                ></span>
              </div>
            ))
          ) : null}
        </div>

        {/* message error */}
        {isEmpty(textError) === false ? (
          <h6 className="mv0 pl1 red">{textError}</h6>
        ) : (
          ''
        )}
        <div className="sendMessage flex w-100">
          <div
            className="w-100"
            // style={{
            //   backgroundColor: '#d4d4d47a',
            //   borderColor: '#d4d4d4ad',
            // }}
          >
            {mentions[0].name && <MessageInput mentions={mentions} />}
            <textarea
              autoFocus={true}
              ref={inputMessageRef}
              className="w-100 pl3 pt3-ns pt2"
              style={{
                resize: 'none',
                outline: 'none',
                border: 'none',
                backgroundColor: 'rgb(232, 232, 232)',
                display: 'none',
              }}
              value={
                isEqual(text.length, 1) && isEqual(text, '\n')
                  ? resetMessage(text)
                  : text
              }
              onChange={onChange}
              onKeyPress={handleKeyPress}
              onKeyUp={() => {
                setTypingTimer(
                  setTimeout(doneTyping, typingInterval),
                );
                clearTimeout(typingTimer);
              }}
              onKeyDown={() => {
                clearTimeout(typingTimer);
              }}
              placeholder="Type your message and hit ENTER to send"
            ></textarea>
            <Button
              className="bp3-minimal outline-0 toggle-emoji dn"
              onClick={toggleEmojiPicker}
            >
              <span className="bp3-icon">
                <img
                  src={SmileIcon}
                  width="30px"
                  height="30px"
                  color="#3F61C5"
                  alt=""
                />
              </span>
            </Button>
          </div>
          <Button
            className="bp3-minimal outline-0 dn"
            onClick={() => setShowFileDialog(true)}
          >
            <span className="bp3-icon">
              <img
                src={AttachmentIcon}
                width="30px"
                height="30px"
                color="#3F61C5"
                alt=""
              />
            </span>
          </Button>
          <Button
            className="bp3-minimal outline-0 dn"
            onClick={handleMessageSend}
          >
            <span className="bp3-icon">
              <img
                src={SendIcon}
                width="30px"
                height="30px"
                color="#3F61C5"
                alt=""
              />
            </span>
          </Button>
        </div>
      </div>
      {showFileDialog && (
        <Dialog
          icon="briefcase"
          onClose={() => setShowFileDialog(!showFileDialog)}
          isOpen
          style={{ background: '#fff' }}
        >
          <FileUpload
            setShowDialog={setShowFileDialog}
            roomID={props.currentRoom._id}
          />
        </Dialog>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    profileImage: state.userReducer.user.profileImage,
    currentRoom: state.roomReducer.currentRoom,
    emojiPicker: state.roomReducer.emojiPicker,
    typingUsers: state.roomReducer.typing.users,
    pendingFiles: state.roomReducer.pendingFiles,
    roomUsers: state.roomReducer.users,
    user: state.userReducer.user,
  };
};
export const SendMessageForm = connect(mapStateToProps, {
  sendRoomMessage,
})(SendMessageFormComponent);
