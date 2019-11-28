import React from "react";
import { Icon } from "@blueprintjs/core";
import { Entity } from "stores/UtilsActions";
import { Form, Field } from "react-final-form";
import { required } from "components/common/final-form/utils";
import { IconNames } from "@blueprintjs/icons";
import TextInput from "components/common/final-form/TextInput";
import SubmitResetButtons from "components/common/final-form/SubmitResetButtons";
import SelectInput from "components/common/final-form/SelectInput";
import Error from "components/common/final-form/Error";
import { Condition } from "components/common/final-form/Condition";
import { ICompanyMembers } from "stores/company/Reducer";

interface AddDesignationFormProps {
	member: ICompanyMembers | undefined;
	setShowDialogAdd: (val: boolean) => void;
	addDesignation: (values: any, memberId: string) => void;
	getCompanyMembers: () => void;
	divisions: Entity[];
	departments: Entity[];
}

export const AddDesignationForm = (props: AddDesignationFormProps) => {
	const onSubmit: any = async (values: any) => {
		if (props.member) {
			const status: any = await props.addDesignation(values, props.member._id);
			if (status === 201) {
				await props.getCompanyMembers();
				props.setShowDialogAdd(false);
			}
		}
		return {};
	};

	return (
		<Form
			onSubmit={onSubmit}
			// initialValues={{ division: "", department: "", position: "" }}
			// validate={values => {
			// 	const errors: any = {};
			// 	if (!values.name) {
			// 		errors.name = "Required";
			// 	}
			// 	return errors;
			// }}
			render={({ handleSubmit, form, submitting, pristine, values }) => (
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
						<div className="flex flex-column">
							<Field<string>
								name="division"
								component={SelectInput}
								validate={required}
							>
								<option selected value="">
									Please select a value
								</option>
								{props.divisions &&
									props.divisions.length &&
									props.divisions.map((d: Entity) => (
										<option value={d._id}>{d.name}</option>
									))}
							</Field>
							<Error name={"division"} />
							<Condition
								when="division"
								validate={(value => {
									return [
										"seniorManager",
										"middleManager",
										"operationalEmployee"
									].includes(value);
								})}
							>
								<Field<string>
									name="department"
									component={SelectInput}
									validate={required}
								>
									<option selected value="">
										Please select a value
									</option>
									{props.departments &&
										props.departments.length &&
										props.departments.map((d: Entity) => (
											<option value={d._id}>{d.name}</option>
										))}
								</Field>
								<Error name={"department"} />
							</Condition>
						</div>
						<Field<string>
							name="position"
							placeHolder="Position"
							component={TextInput}
							validate={required}
							leftIcon="id-number"
						/>
						<Error name={"position"} />
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
