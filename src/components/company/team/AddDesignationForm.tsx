import React from "react";
import { Icon } from "@blueprintjs/core";
import { Entity } from "stores/UtilsActions";
import { Form, Field } from "react-final-form";
import { required } from "helpers/final-form";
import { IconNames } from "@blueprintjs/icons";
import TextInput from "components/common/final-form/TextInput";
import SubmitResetButtons from "components/common/final-form/SubmitResetButtons";
import SelectInput from "components/common/final-form/SelectInput";

interface AddDesignationFormProps {
	setShowDialogAdd: (val: boolean) => void;
	divisions: Entity[];
	departments: Entity[];
}

interface AddDesignationFormInternalProps extends AddDesignationFormProps {}

export const AddDesignationForm = (props: AddDesignationFormInternalProps) => {
	const onSubmit: any = async (values: any) => {
		// const status: any = await props.createRoomAction(values);
		// if (status === 409) {
		// 	return { name: "Duplicate name" };
		// 	// return { [FORM_ERROR]: "Duplicate name" };
		// } else if (status === 201) {
		// 	props.setShowDialog(false);
		// }
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
				<div>
					<div className="flex justify-end pa3">
						<Icon
							icon={IconNames.DELETE}
							iconSize={20}
							className="grow pointer tigrow-lightBlue"
							onClick={(e: any) => props.setShowDialogAdd(false)}
						/>
					</div>
					<form className="fl w-100 pa4 pt0" onSubmit={handleSubmit}>
						<h1 className="f5 tigrow-lightBlue">Add Role</h1>
						<div className="flex justify-between">
							<Field<string>
								name="divisions"
								component={SelectInput}
								divisions={props.divisions}
								placeHolder="Please select a division"
							/>
							<Field<string>
								name="departments"
								component={SelectInput}
								departments={props.departments}
								placeHolder="Please select a department"
							/>
						</div>
						<Field<string>
							name="position"
							placeHolder="Position"
							component={TextInput}
							validate={required}
							leftIcon="id-number"
						/>
						<SubmitResetButtons
							reset={form.reset}
							submitting={submitting}
							pristine={pristine}
							resetBtnName="Reset"
							submitBtnName="Save"
						/>
					</form>
				</div>
			)}
		/>
	);
};
