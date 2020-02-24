import React, { useState, useEffect, useRef } from 'react';
import { Button, Dialog } from '@blueprintjs/core';
import { connect, useDispatch } from 'react-redux';
import { trim, isEqual, isEmpty } from 'lodash';
import { sendRoomMessage } from 'stores/room/Actions';
import 'emoji-mart/css/emoji-mart.css';
import { TOGGLE_EMOJI_PICKER, CLEAR_FILE_UPLOAD, DELETE_ONE_PENDING_FILE } from 'stores/room/Types';
import ReactDOM from 'react-dom';
import { Picker } from 'emoji-mart';
import { FileUpload } from './fileUpload';
import { IRoomFile } from 'stores/room/Reducer';
import SmileIcon from './../../../../../resources/images/Emoji.svg';
import SendIcon from './../../../../../resources/images/Send.svg';
import AttachmentIcon from './../../../../../resources/images/attachment.svg';

// tslint:disable-next-line: no-var-requires
const { withChatkit } = require('@pusher/chatkit-client-react');

interface SendMessageFormProps {
	chatkit?: any;
	sendRoomMessage: (data: { text: string, room: string, files: any[], type?: string }) => void;
	roomId: string;
	profileImage: any;
	emojiPicker: boolean;
	pendingFiles: IRoomFile[];
	typingUsers: Array<{ name: string, roomId: string; }>;
}

const SendMessageFormComponent = withChatkit((props: SendMessageFormProps) => {
	const [text, setText] = useState('');
	const [showFileDialog, setShowFileDialog] = useState(false);
	const [textError, setTextError] = useState('');
	const messageLimit = 3500;

	const inputMessageRef = useRef<HTMLTextAreaElement>(null);
	const emojiRef = useRef<any>(null);

	const dispatch = useDispatch();

	useEffect(() => {
		setText('');
		setTextError('');
		setShowFileDialog(false);
		dispatch({ type: CLEAR_FILE_UPLOAD });
	}, [props.roomId]);

	// tslint:disable-next-line: no-shadowed-variable
	const resetMessage = (text: string) => {
		const resetText = text.replace(/(\r\n|\n|\r)/gm, '');
		setText(resetText);
		return resetText;
	};

	const onChange = (e: any) => {
		setText(e.target.value);
		props.chatkit.currentUser
			.isTypingIn({ roomId: props.roomId })
			// tslint:disable-next-line: no-console
			.catch((error: any) => console.error('error on typing', error));
	};

	const sendMessage = async (_text: string, type: string) => {
		setText('');
		setTextError('');

		const files = props.pendingFiles && props.pendingFiles.length ?
			props.pendingFiles.map(file => ({
				_id: file._id,
				link: file.link,
				s3Key: file.s3Key,
			}))
			: [];

		dispatch({ type: CLEAR_FILE_UPLOAD });
		setText('');

		await props.sendRoomMessage({
			text: _text,
			room: props.roomId,
			files,
			type
		});
	};

	const handleMessageSend = () => {
		const trimmedText = trim(text);
		if (isEmpty(trimmedText) === false && trimmedText.length <= messageLimit && props.pendingFiles.length > 0) {
			sendMessage(trimmedText, 'attachment');
		} else if (isEmpty(trimmedText) === false && trimmedText.length <= messageLimit && props.pendingFiles.length === 0) {
			sendMessage(trimmedText, 'text');
		} else if (isEmpty(trimmedText) === true && props.pendingFiles.length > 0) {
			sendMessage(trimmedText, 'file');
		} else if (isEmpty(trimmedText) === true) {
			setTextError('');
			setText(trimmedText);
		} else {
			setTextError(`Message should be less than ${messageLimit} character`);
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
			payload: !props.emojiPicker
		});
	};

	const addEmoji = (emoji: any) => {
		const t = `${text} ${emoji.native}`;
		setText(t);
		dispatch({
			type: TOGGLE_EMOJI_PICKER,
			payload: false
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
				? props.typingUsers.map(
					(user: { name: string; roomId: string }, i: number) => {
						if (
							isEmpty(props.roomId) === false &&
							isEqual(props.roomId, user.roomId) === true
						) {
							return (
								<h6 key={i} className="mv1 pl1">
									{user.name} is typing ...
									</h6>
							);
						}
						return null;
					}
				)
				: ''}

			{/* Emoji picker */}
			{props.emojiPicker ? (
				<Picker
					set="twitter"
					onSelect={addEmoji}
					emoji="sunglasses"
					title="TiGrow Ltd"
					autoFocus={true}
					color="#0fa3a3"
					ref={emojiRef}
				/>
			) : null
			}

			{/* pendingFiles */}
			<div className="flex w-100 flex-wrap b--black-10 ba"
			>
				{
					props.pendingFiles && props.pendingFiles.length ?
						props.pendingFiles.map(file =>
							(
								<div className="bg-tigrowLightBlue flex pa3 ma1 br-pill justify-center items-center">
									<p className="white ma0">
										{file.s3Key.split('/')[1]}
									</p>
									<span
										className="bp3-tag-remove bp3-icon-delete mh2 w1 h1"
										style={{ backgroundColor: 'white', color: '#0fa3a3', borderRadius: '30px', paddingTop: '1px' }}
										onClick={() => {
											dispatch({
												type: DELETE_ONE_PENDING_FILE,
												payload: file._id
											});
										}}
									></span>
								</div>
							))
						: null
				}
			</div>

			{/* message error */}
			{
				isEmpty(textError) === false ?
					<h6 className="mv0 pl1 red">
						{textError}
					</h6> : ''
			}
			<div className="sendMessage flex w-100 justify-around">
				{/* <div className="flex items-center mh1" style={{ width: "42px" }}>
					<img
						src={props.profileImage ? props.profileImage.imageSource : UserIcon}
						className="db br-100"
						style={{ width: "40px", height: "40px", objectFit: "cover" }}
						alt="user"
					/>
				</div> */}
				<div
					className="w-100 mv2 mh1 br3 flex"
					style={{
						backgroundColor: '#d4d4d47a',
						borderColor: '#d4d4d4ad'
					}}
				>
					<textarea
						autoFocus={true}
						ref={inputMessageRef}
						className="w-100 pl3 pt3"
						style={{
							resize: 'none',
							outline: 'none',
							border: 'none',
							backgroundColor: 'rgb(232, 232, 232)'
						}}
						value={isEqual(text.length, 1) && isEqual(text, '\n') ? resetMessage(text) : text}
						onChange={onChange}
						onKeyPress={handleKeyPress}
						placeholder="Type your message and hit ENTER to send"
					></textarea>
					<Button
						className="bp3-minimal outline-0 toggle-emoji"
						onClick={toggleEmojiPicker}
					>
						<span className="bp3-icon">
							<img
								src={SmileIcon}
								width="30px"
								height="30px"
								color="#0FA3A3"
							/>
						</span>
					</Button>
				</div>
				{/* TODO onKeyPress has not found yet */}
				{/* <ReactTextareaAutocomplete
					className="message-input my-textarea"
					value={isEqual(text.length, 1) && isEqual(text, "\n") ? resetMessage(text) : text}
					loadingComponent={() => <span>Loading</span>}
					onChange={onChange}
					trigger={{
						':': {
							dataProvider: (token: any): any => {
								if (token) {
									let a = (emojiIndex.search(token) as any).map((o: BaseEmoji) => ({
										colons: o.colons,
										native: o.native,
									}));
									return a;
								}
								return null;
							},
							component: (obj: any) => {
								const { colons, native } = obj.entity;
								return (
									<div>{`${colons.replace(/:/, '')} ${native}`}</div>
								)
							},
							output: (item: any) => `${item.native}`,
						},
					}}
				/> */}
				<Button
					className="bp3-minimal outline-0"
					onClick={handleMessageSend}
				>
					<span className="bp3-icon">
						<img
							src={SendIcon}
							width="30px"
							height="30px"
							color="#0FA3A3"
						/>
					</span>
				</Button>
				<Button
					className="bp3-minimal outline-0"
					onClick={() => setShowFileDialog(true)}
				>
					<span className="bp3-icon">
						<img
							src={AttachmentIcon}
							width="30px"
							height="30px"
							color="#0FA3A3"
						/>
					</span>
				</Button>
			</div>
			{/* <div>{JSON.stringify({ text, length: text.length, sendStatus }, null, 2)}</div> */}
			{showFileDialog && (
				<Dialog
					icon="briefcase"
					onClose={() => setShowFileDialog(!showFileDialog)}
					isOpen
					style={{ background: '#fff' }}
				>
					<FileUpload setShowDialog={setShowFileDialog} roomID={props.roomId} />
				</Dialog>
			)}
		</>
	);
});

const mapStateToProps = (state: any) => {
	return {
		profileImage: state.userReducer.user.profileImage,
		roomId: state.roomReducer.roomId,
		emojiPicker: state.roomReducer.emojiPicker,
		typingUsers: state.roomReducer.typing.users,
		pendingFiles: state.roomReducer.pendingFiles
	};
};
export const SendMessageForm = connect(mapStateToProps, { sendRoomMessage })(SendMessageFormComponent);
