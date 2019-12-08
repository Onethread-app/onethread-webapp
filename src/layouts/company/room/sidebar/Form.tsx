import React from "react";
import { Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { connect, useSelector, useDispatch } from "react-redux";
import { createRoomAction } from "stores/room/Actions";
import { Form, Field } from "react-final-form";
import { required, composeValidators, maxValue } from "components/final-form/utils";
import { SubmitAndResetButtons } from "components/final-form/SubmitResetButtons";
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { checkError } from 'components/final-form/utils';
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
							validate={composeValidators(required, maxValue(20))}
							render={({ input, meta }) =>
								<InputGroupFieldWithError
									id={input.name}
									className={`br0 ${checkError(meta) ? "bb b--red" : "bb b--lightBlue"}`}
									placeHolder="Room name"
									value={input.value}
									onChange={input.onChange}
									leftIcon="layout-balloon"
									leftIconColor={`${checkError(meta) ? "red" : "#0fa3a3"}`}
									style={{ boxShadow: "none" }}
									error={checkError(meta) && (meta.error || meta.submitError)}
								/>
							}
						/>
						<SubmitAndResetButtons
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
