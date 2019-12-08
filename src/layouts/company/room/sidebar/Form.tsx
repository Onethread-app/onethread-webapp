import React from "react";
import { Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { withRouter, RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import { createRoomAction } from "stores/room/Actions";
import { Form, Field } from "react-final-form";
import { required } from "components/final-form/utils";
import { SubmitAndResetButtons } from "components/final-form/SubmitResetButtons";
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { checkError } from 'components/final-form/utils';

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
							validate={required}
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
};

const mapStateToProps = (state: any) => {
	return {};
};

export const CreateForm = connect(mapStateToProps, {
	createRoomAction
})(withRouter(CreateFormComponent));
