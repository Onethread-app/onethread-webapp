import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { isEmpty } from 'lodash';
import { RoomList } from "components/company/workplace/rooms/RoomList";

export const RoomPageComponent = (props: any) => {
	const [rooms, setRooms] = useState([]);

	useEffect(() => {
		if (!isEmpty(props.chatkit.user)) {
			let r = props.chatkit.user.rooms.map((r: any) => {
				return {
					id: r.id,
					roomImg: "https://robohash.org/SQA" + r.id,
					roomTitle: r.name
				}
			})

			setRooms(r);
		}
	}, [props.chatkit.user]);

	return (
		<div className="cf">
			<div className="fl w-20 ba pa2">
				<RoomList rooms={rooms} />
			</div>
			<div className="fl w-80 ba pa2">chat</div>
		</div>
	);
};

const mapStateToProps = (state: any) => {
	return {
		chatkit: state.chatkit
	};
};

export const RoomPage = connect(
	mapStateToProps,
	null
)(withRouter(RoomPageComponent));
