import React from "react";
import { InputGroupField } from "components/common/field/InputGroup";
import { Button, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import { withRouter, RouteComponentProps } from "react-router";
import { connect } from "react-redux";
import { createRoomAction, clearRoomError } from "stores/room/Actions";
import { Form, Field } from "react-final-form";

interface CreateFormProps {
	setShowDialog: (val: boolean) => void;
}

interface CreateFormInternalProps extends CreateFormProps, RouteComponentProps {
	createRoomAction: (val: any) => void;
	clearRoomError: () => void;
	roomError: string;
	loading: boolean;
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

	const checkError = (meta: any) => {
		if ((meta.error || meta.submitError) && meta.touched) {
			return true;
		} else {
			return false;
		}
	};

	return (
		<Form
			onSubmit={onSubmit}
			initialValues={{ name: "" }}
			validate={values => {
				const errors: any = {};
				if (!values.name) {
					errors.name = "Required";
				}
				return errors;
			}}
			render={({ handleSubmit, form, submitting, pristine, invalid }) => (
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
						<Field name="name" type="text">
							{({ input, meta }) => (
								<>
									<div className={` ${checkError(meta) ? "mb3" : "mb4"}`}>
										<div className="">
											<InputGroupField
												{...input}
												id="roomName"
												placeHolder="Username"
												leftIcon="layout-balloon"
												leftIconColor={`${
													checkError(meta) ? "red" : "#0fa3a3"
												}`}
												className={`br0 ${
													checkError(meta) ? "bb b--red" : "bb b--lightBlue"
												}`}
												style={{
													boxShadow: "none"
												}}
											/>
										</div>
										{checkError(meta) && (
											<small style={{ color: "red" }}>
												{meta.error || meta.submitError}
											</small>
										)}
									</div>
								</>
							)}
						</Field>
						<div className="flex justify-end mt4">
							<Button
								icon="refresh"
								className="grow h2 pointer white bp3-minimal w4 mr3"
								style={{
									background: "#fff",
									outline: "none",
									border: "1px solid #0fa3a3",
									color: "#0fa3a3"
								}}
								onClick={form.reset}
								disabled={submitting || pristine}
							>
								Reset
							</Button>
							<Button
								className="grow h2 pointer white bp3-minimal w4"
								style={{
									background: "#0fa3a3",
									outline: "none",
									color: "white"
								}}
								type="submit"
								disabled={submitting || invalid}
							>
								Add
							</Button>
						</div>
					</form>
				</>
			)}
		/>
	);
};

const mapStateToProps = (state: any) => {
	return {
		loading: state.roomReducer.loading,
		roomError: state.roomReducer.roomError
	};
};

export const CreateForm = connect(mapStateToProps, {
	createRoomAction,
	clearRoomError
})(withRouter(CreateFormComponent));
