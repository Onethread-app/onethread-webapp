import React from "react";
import { Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { connect, useSelector, useDispatch } from "react-redux";
import { createRoomAction } from "stores/room/Actions";
import { Form, Field } from "react-final-form";
import { required, composeValidators, maxValue } from "components/common/final-form/utils";
import TextInput from "components/common/final-form/TextInput";
import Error from "components/common/final-form/Error";
import SubmitResetButtons from "components/common/final-form/SubmitResetButtons";
import { GET_ROOMS } from 'stores/room/Types';
const { withChatkit } = require("@pusher/chatkit-client-react");

interface CreateFormProps {
	setShowDialog: (val: boolean) => void;
}

interface CreateFormInternalProps extends CreateFormProps {
	chatkit?: any;
	createRoomAction: (val: any) => void;
}

const CreateFormComponent: React.FC<any> = withChatkit((props: CreateFormInternalProps) => {
	const dispatch = useDispatch();

	const companyId = useSelector((state: any) => state.companyReducer.currentCompany._id);

	const onSubmit: any = async (values: any) => {
		const status: any = await props.createRoomAction(values);
		if (status === 409) {
			return { name: "Duplicate name" };
		} else if (status === 201) {
			if (!props.chatkit.isLoading) {
				let rooms = props.chatkit.currentUser.rooms.filter((room: any) => room.customData.company === companyId);
				await dispatch({ type: GET_ROOMS, payload: rooms });
				props.setShowDialog(false);
			}
		}
		return {};
	};

	return (
		<Form
			onSubmit={onSubmit}
			initialValues={{ name: "" }}
			render={({ handleSubmit, form, submitting, pristine }) => (
				<>
					<div className="flex justify-end pa3">
						<Icon
							icon={IconNames.DELETE}
							iconSize={20}
							className="grow pointer tigrow-lightBlue"
							onClick={(e: any) => props.setShowDialog(false)}
						/>
					</div>
					<form className="fl w-100 pa4 pt0" onSubmit={handleSubmit}>
						<h1 className="f5 tigrow-lightBlue">Create Room</h1>
						<Field<string>
							name="name"
							placeHolder="Room name"
							component={TextInput}
							validate={composeValidators(required, maxValue(20))}
							leftIcon="layout-balloon"
						/>
						<Error name={"name"} />
						<SubmitResetButtons
							reset={form.reset}
							submitting={submitting}
							pristine={pristine}
							resetBtnName="Reset"
							submitBtnName="Add"
						/>
					</form>
				</>
			)}
		/>
	);
});

export const CreateForm = connect(null, {
	createRoomAction
})(CreateFormComponent);
