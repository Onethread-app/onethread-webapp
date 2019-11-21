import React from "react";
import { Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { withRouter, RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import { createRoomAction } from "stores/room/Actions";
import { Form, Field } from "react-final-form";
import { required } from "helpers/final-form";
import TextInput from "components/common/final-form/TextInput";
import SubmitResetButtons from "components/common/final-form/SubmitResetButtons";

interface CreateFormProps {
	setShowDialog: (val: boolean) => void;
}

interface CreateFormInternalProps extends CreateFormProps, RouteComponentProps {
	createRoomAction: (val: any) => void;
}

const CreateFormComponent = (props: CreateFormInternalProps) => {
	const onSubmit: any = async (values: any) => {
		const status: any = await props.createRoomAction(values);
		if (status === 409) {
			return { name: "Duplicate name" };
		} else if (status === 201) {
			props.setShowDialog(false);
		}
		return {};
	};

	return (
		<Form
			onSubmit={onSubmit}
			initialValues={{ name: "" }}
			// validate={values => {
			// 	const errors: any = {};
			// 	if (!values.name) {
			// 		errors.name = "Required";
			// 	}
			// 	return errors;
			// }}
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
							validate={required}
							leftIcon="layout-balloon"
						/>
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
};

const mapStateToProps = (state: any) => {
	return {};
};

export const CreateForm = connect(mapStateToProps, {
	createRoomAction
})(withRouter(CreateFormComponent));
