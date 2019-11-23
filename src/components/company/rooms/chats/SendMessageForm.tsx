import React, { useState, useEffect, useRef } from "react";
import { Button, FileInput, Dialog } from "@blueprintjs/core";
import user from "../../../../resources/images/user.png";
import { useSelector } from "react-redux";
const { withChatkit } = require("@pusher/chatkit-client-react");

interface SendMessageFormProps {
	chatkit?: any;
}

export const SendMessageForm = withChatkit((props: SendMessageFormProps) => {
	const roomId = useSelector((state: any) => state.roomReducer.activeRoom.id);
	const [text, setText] = useState("hello");
	const [showDialog, setShowDialog] = useState(false);
	const inputMessageRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		setText("");
	}, [roomId]);
	const sendMessage = (text: string) => {
		// TODO: send to backend
		props.chatkit.currentUser.sendSimpleMessage({
			roomId,
			text
		});
	};
	const onChange = (e: any) => {
		setText(e.target.value);
		props.chatkit.currentUser
			.isTypingIn({ roomId })
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
		if (e.key === "Enter" && text !== "") {
			sendMessage(text);
			setText("");
			e.target.value = "";
			(inputMessageRef.current as any).value = "";
			// console.log("inputMessageRef", a(inputMessageRef));
		}
	};

	// useEffect(() => {
	//   console.log("inputMessageRef", a(inputMessageRef));
	// }, []);

	return (
		<>
			<div className="sendMessage shadow-3 flex w-100 bg-tigrow justify-around">
				<div className="flex items-center mh1" style={{ width: "42px" }}>
					<img src={user} className="dib" alt="user" />
				</div>
				<textarea
					ref={inputMessageRef}
					className="w-100 mv2 mr1"
					style={{ resize: "none" }}
					value={text}
					onChange={onChange}
					onKeyPress={handleKeyPress}
					placeholder="Write your message "
				></textarea>
				{/* <Button
					className="bp3-minimal outline-0 mh2 w2 mv3"
					onClick={() => setShowDialog(true)}
				>
					<Icon icon="link" className="tigrow-lightBlue" />
				</Button> */}
			</div>
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
