import React, {
  ReactElement,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { connect, useDispatch } from 'react-redux';
import {
  DraftHandleValue,
  EditorState,
  getDefaultKeyBinding,
  RichUtils,
  convertToRaw,
} from 'draft-js';
import Editor from '@draft-js-plugins/editor';
import createMentionPlugin, {
  defaultSuggestionsFilter,
  MentionData,
} from '@draft-js-plugins/mention';
import createEmojiPlugin, {
  defaultTheme,
} from '@draft-js-plugins/emoji';
import { trim } from 'lodash';

import SendIcon from '@material-ui/icons/Send';
import AttachFileIcon from '@material-ui/icons/AttachFile';

import { sendRoomMessage } from 'stores/room/Actions';
import { IRoomPendingFile, IRoomReducer } from 'stores/room/Reducer';
import { CLEAR_FILE_UPLOAD } from 'stores/room/Types';

import editorStyles from './CustomMentionEditor.module.css';
import '@draft-js-plugins/mention/lib/plugin.css';
import '@draft-js-plugins/emoji/lib/plugin.css';
import './MessageInput.scss';

import ErrorSnackbar from './ErrorSnackbar';

interface ICustomMentionEditor {
  currentRoom: IRoomReducer['currentRoom'];
  mentions: MentionData[];
  pendingFiles: IRoomPendingFile[];
  sendRoomMessage: (data: {
    text: string;
    room: string;
    files: any[];
    type?: string;
  }) => void;
  setShowFileDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

const CustomMentionEditor = (
  props: ICustomMentionEditor,
): ReactElement => {
  const ref = useRef<Editor>(null);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(),
  );
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<MentionData[]>(
    props.mentions,
  );
  const [messageError, setMessageError] = useState('');

  const messageLimit = 3500;
  const dispatch = useDispatch();
  // const { hasCommandModifier } = KeyBindingUtil;
  defaultTheme.emojiSelectPopover =
    defaultTheme.emojiSelectPopover + ' my-emoji-popover';

  const {
    MentionSuggestions,
    EmojiSuggestions,
    EmojiSelect,
    plugins,
  } = useMemo(() => {
    const mentionPlugin = createMentionPlugin();
    // eslint-disable-next-line no-shadow
    const { MentionSuggestions } = mentionPlugin;

    const emojiPlugin = createEmojiPlugin({
      useNativeArt: true,
      theme: defaultTheme,
    });
    // eslint-disable-next-line no-shadow
    const { EmojiSuggestions, EmojiSelect } = emojiPlugin;

    // eslint-disable-next-line no-shadow
    const plugins = [mentionPlugin, emojiPlugin];
    return {
      plugins,
      MentionSuggestions,
      EmojiSuggestions,
      EmojiSelect,
    };
  }, []);

  const onChange = useCallback((_editorState: EditorState) => {
    setEditorState(_editorState);
  }, []);
  const onOpenChange = useCallback((_open: boolean) => {
    setOpen(_open);
  }, []);
  const onSearchChange = useCallback(
    ({ value }: { value: string }) => {
      setSuggestions(defaultSuggestionsFilter(value, props.mentions));
    },
    [],
  );

  function myKeyBindingFn(e: any): string | null {
    if (e.keyCode === 13 /* enter key */) {
      if (e.nativeEvent.shiftKey) {
        return 'myeditor-newline';
      } else {
        return 'myeditor-save';
      }
    }
    return getDefaultKeyBinding(e);
  }

  const sendMessage = async (_text: string, type: string) => {
    const files =
      props.pendingFiles && props.pendingFiles.length
        ? props.pendingFiles.map((file) => ({
            _id: file._id,
            link: file.link,
            s3Key: file.s3Key,
          }))
        : [];

    dispatch({ type: CLEAR_FILE_UPLOAD });

    await props.sendRoomMessage({
      text: _text,
      room: props.currentRoom._id,
      files,
      type,
    });
  };

  const handleSend = () => {
    const content = editorState.getCurrentContent();
    const rawContent = convertToRaw(content);
    const msgText = rawContent.blocks[0].text;
    setEditorState(EditorState.createEmpty());
    const trimmedText = trim(msgText);

    if (trimmedText.length > messageLimit) {
      setMessageError(
        `Message should be less than ${messageLimit} character`,
      );
    } else if (
      trimmedText.length > 0 &&
      trimmedText.length < messageLimit &&
      props.pendingFiles.length === 0
    ) {
      sendMessage(trimmedText, 'text');
    } else if (
      trimmedText.length === 0 &&
      props.pendingFiles.length > 0
    ) {
      sendMessage(trimmedText, 'file');
    } else if (
      trimmedText.length > 0 &&
      props.pendingFiles.length > 0
    ) {
      sendMessage(trimmedText, 'attachment');
    } else {
      setMessageError('Cannot send empty message');
    }
  };

  const handleKeyCommand = (command: string): DraftHandleValue => {
    if (command === 'myeditor-save') {
      handleSend();
      return 'handled';
    } else if (command === 'myeditor-newline') {
      const newEditorState = RichUtils.insertSoftNewline(editorState);
      setEditorState(newEditorState);
      return 'handled';
    }
    return 'not-handled';
  };

  return (
    <>
      <div className="flex w-100 items-center">
        <div
          className={`${editorStyles.editor} flex w-100 pa2 mr1`}
          onClick={() => {
            ref.current!.focus();
          }}
        >
          <Editor
            editorKey={'editor'}
            editorState={editorState}
            handleKeyCommand={(cmd) => handleKeyCommand(cmd)}
            keyBindingFn={myKeyBindingFn}
            onChange={onChange}
            plugins={plugins}
            ref={ref}
            placeholder="Type your message and hit ENTER to send"
          />
          <MentionSuggestions
            open={open}
            onOpenChange={onOpenChange}
            suggestions={suggestions}
            onSearchChange={onSearchChange}
            onAddMention={() => {
              // get the mention object selected
            }}
          />
        </div>
        <EmojiSuggestions />

        <EmojiSelect closeOnEmojiSelect />
        <AttachFileIcon
          className="pointer"
          style={{ color: '#3F61C5', margin: '0 .5rem' }}
          onClick={() => props.setShowFileDialog(true)}
        />
        <SendIcon
          className="pointer"
          style={{ color: '#3F61C5', margin: '0 .5rem' }}
          onClick={handleSend}
        />
      </div>
      {messageError && (
        <ErrorSnackbar
          messageError={messageError}
          setMessageError={setMessageError}
        />
      )}
    </>
  );
};

const mapStateToProps = (state: any) => ({
  currentRoom: state.roomReducer.currentRoom,
  pendingFiles: state.roomReducer.pendingFiles,
});

export default connect(mapStateToProps, { sendRoomMessage })(
  CustomMentionEditor,
);
