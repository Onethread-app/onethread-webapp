import React, { useState, useEffect } from "react";
import { NavbarTop } from "components/Navbar";
import { WorkplaceSidebar } from "components/WorkplaceSidebar";
import { RoomList } from 'components/company/workplace/rooms/RoomList';
const chatKitClient = require('@pusher/chatkit-client');

export const RoomPage = () => {

	const [rooms] = useState([{
		id: "1", roomImg: "http://mrmrs.github.io/photos/p/2.jpg",
		roomTitle: "Backend",
	}, {
		id: "2", roomImg: "http://mrmrs.github.io/photos/p/3.jpg",
		roomTitle: "Frontend",
	},
	{
		id: "3", roomImg: "http://mrmrs.github.io/photos/p/4.jpg",
		roomTitle: "UX/UI",
	}, {
		id: "4",
		roomImg: "http://mrmrs.github.io/photos/p/5.jpg",
		roomTitle: "SQA",
	}]);
	const [alreadySetUser, setAlreadySetUser] = useState(false)
	const [user, setUser] = useState({} as any);
	const [joinedRoom, setJoinedRoom] = useState([]);
	const [joinableRooms, setJoinableRooms] = useState([]);

	useEffect(() => {
		const chatManager = new chatKitClient.ChatManager({
			instanceLocator: 'v1:us1:8f737fc2-ce0a-4e83-952d-0081becf93c5',
			userId: '5d84c61420e4385604d3eded',
			tokenProvider: new chatKitClient.TokenProvider({ url: 'https://us1.pusherplatform.io/services/chatkit_token_provider/v1/8f737fc2-ce0a-4e83-952d-0081becf93c5/token' })
		});
		chatManager.connect()
			.then((currentUser: any) => {
				setUser(currentUser);
				setAlreadySetUser(true);
				console.log(alreadySetUser);
				console.log(user);
				getRooms()
			})
			.catch((err: any) => {
				console.log('Error on connection', err)
			})

	}, [alreadySetUser]);

	useEffect(() => {
		console.log(joinableRooms);
		console.log("joinableRooms");
	}, [joinableRooms]);

	useEffect(() => {
		console.log(joinedRoom);
		console.log("joinedRoom");

	}, [joinedRoom]);

	const getRooms = () => {
		user.getJoinableRooms()
			.then((joinableRooms: any) => {
				setJoinableRooms(joinableRooms);
				setJoinedRoom(user.room);
			})
			.catch((err: any) => console.log('error on joinableRooms: ', err))
	}

	return (
		<div className="bg-near-white">
			<NavbarTop />
			<div className="w-100 cf ">
				<div className="fl bg-white w-10 pv6 vh-100 fixed">
					<WorkplaceSidebar />
				</div>
				<div className="fl w-80 mt5" style={{ marginLeft: "10rem" }}>
					<div className="fl w-20 ba pa2">
						<RoomList rooms={rooms} /></div>
					<div className="fl w-80 ba pa2">chat</div>
				</div>
			</div>
		</div>
	);
};
