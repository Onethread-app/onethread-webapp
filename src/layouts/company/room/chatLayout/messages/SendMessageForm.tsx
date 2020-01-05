import React, { useState, useEffect, useRef } from "react";
import { Button, FileInput, Dialog } from "@blueprintjs/core";
import { connect, useDispatch } from "react-redux";
import { trim, isEqual, isEmpty } from "lodash";
import { sendRoomMessage } from 'stores/room/Actions';
import 'emoji-mart/css/emoji-mart.css';
import { TOGGLE_EMOJI_PICKER } from 'stores/room/Types';
import ReactDOM from 'react-dom';
import { Picker } from 'emoji-mart';

const { withChatkit } = require("@pusher/chatkit-client-react");
// const UserIcon = require('./../../../../../resources/images/user.png');
const SmileIcon = require('./../../../../../resources/images/smile-24px.svg');

interface SendMessageFormProps {
	chatkit?: any;
	sendRoomMessage: (data: { text: string, room: string, type?: string }) => void;
	roomId: string;
	profileImage: any;
	emojiPicker: boolean;
	typingUsers: { name: string, roomId: string; }[]
}

const SendMessageFormComponent = withChatkit((props: SendMessageFormProps) => {
	const [text, setText] = useState("");
	const [showDialog, setShowDialog] = useState(false);

	const inputMessageRef = useRef<HTMLTextAreaElement>(null);
	const emojiRef = useRef<any>(null);

	const dispatch = useDispatch();

	useEffect(() => {
		setText("");
	}, [props.roomId]);


	const sendMessage = async (text: string) => {
		// TODO: Future feature
		await props.sendRoomMessage({ text, room: props.roomId });
	};

	const resetMessage = (text: string) => {
		let resetText = text.replace(/(\r\n|\n|\r)/gm, "")
		setText(resetText)
		return resetText;
	};

	const onChange = (e: any) => {
		setText(e.target.value);
		props.chatkit.currentUser
			.isTypingIn({ roomId: props.roomId })
			.catch((error: any) => console.error("error on typing", error));
	};

	// function a(inputMessageRef: any) {
	// 	return {
	// 		clientHeight: (inputMessageRef.current as any).clientHeight,
	// 		clientLeft: (inputMessageRef.current as any).clientLeft,
	// 		clientTop: (inputMessageRef.current as any).clientTop,
	// 		clientWidth: (inputMessageRef.current as any).clientWidth,
	// 		cols: (inputMessageRef.current as any).cols,
	// 		rows: (inputMessageRef.current as any).rows,
	// 		defaultValue: (inputMessageRef.current as any).defaultValue,
	// 		innerHTML: (inputMessageRef.current as any).innerHTML,
	// 		offsetHeight: (inputMessageRef.current as any).offsetHeight,
	// 		offsetLeft: (inputMessageRef.current as any).offsetLeft,
	// 		offsetTop: (inputMessageRef.current as any).offsetTop,
	// 		offsetWidth: (inputMessageRef.current as any).offsetWidth,
	// 		scrollHeight: (inputMessageRef.current as any).scrollHeight,
	// 		scrollLeft: (inputMessageRef.current as any).scrollLeft,
	// 		scrollTop: (inputMessageRef.current as any).scrollTop,
	// 		scrollWidth: (inputMessageRef.current as any).scrollWidth,
	// 		value: (inputMessageRef.current as any).value
	// 	};
	// }
	const handleKeyPress = (e: any) => {
		// console.log("inputMessageRef", a(inputMessageRef));
		let trimmedText = trim(text);
		if (e.key === "Enter" && e.shiftKey === false && isEmpty(trimmedText) === false) {
			sendMessage(trimmedText);
			setText("");
			// e.target.value = "";
			// (inputMessageRef.current as any).value = "";
			// console.log("inputMessageRef", a(inputMessageRef));
		}
	};

	// useEffect(() => {
	//   console.log("inputMessageRef", a(inputMessageRef));
	// }, []);

	const toggleEmojiPicker = () => {
		dispatch({
			type: TOGGLE_EMOJI_PICKER,
			payload: !props.emojiPicker
		});
	}

	const addEmoji = (emoji: any) => {
		const t = `${text} ${emoji.native}`;
		setText(t);
		dispatch({
			type: TOGGLE_EMOJI_PICKER,
			payload: false
		});
	}

	const checkClickOutside = (e: any) => {
		let node = ReactDOM.findDOMNode(emojiRef.current);
		if (node && !node.contains(e.target)) {
			toggleEmojiPicker();
		}
	};

	useEffect(() => {
		document.addEventListener("click", checkClickOutside);
		return function () {
			document.removeEventListener("click", checkClickOutside);
		};
	});

	return (
		<>
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
				: ""}
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
			<div className="sendMessage shadow-3 flex w-100 justify-around">
				{/* <div className="flex items-center mh1" style={{ width: "42px" }}>
					<img
						src={props.profileImage ? props.profileImage.imageSource : UserIcon}
						className="db br-100"
						style={{ width: "40px", height: "40px", objectFit: "cover" }}
						alt="user"
					/>
				</div> */}
				<textarea
					ref={inputMessageRef}
					className="w-100 mv2 mh1"
					style={{ resize: "none" }}
					value={isEqual(text.length, 1) && isEqual(text, "\n") ? resetMessage(text) : text}
					onChange={onChange}
					onKeyPress={handleKeyPress}
					placeholder="Type your message and hit ENTER to send"
				></textarea>
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
					className="bp3-minimal outline-0 toggle-emoji"
					onClick={toggleEmojiPicker}
				>
					<span className="bp3-icon" style={{ paddingRight: "5px" }}>
						<img
							src={SmileIcon}
							width="30px"
							height="30px"
							color="#0FA3A3"
						/>
					</span>
				</Button>
				{/* <Button
					className="bp3-minimal outline-0 mh2 w2 mv3"
					onClick={() => setShowDialog(true)}
				>
					<Icon icon="link" className="tigrow-lightBlue" />
				</Button> */}
			</div>
			{/* <div>{JSON.stringify({ text, length: text.length, sendStatus }, null, 2)}</div> */}
			{showDialog && (
				<Dialog
					icon="briefcase"
					onClose={() => setShowDialog(!showDialog)}
					isOpen
					style={{ background: "#fff" }}
				>
					<div className="pa3 cf">
						<h1 className="f5">Attach Files</h1>
						<FileInput className="bp3-fill" text="Choose file..." />
						<div>
							<Button
								type="submit"
								text="Attach"
								className="grow h2 pointer w-40 fr mt2"
								style={{
									background: "#0fa3a3",
									outline: "none",
									color: "white",
									boxShadow: "none"
								}}
							/>
						</div>
					</div>
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
		typingUsers: state.roomReducer.typing.users
	}
}
export const SendMessageForm = connect(mapStateToProps, { sendRoomMessage })(SendMessageFormComponent)
