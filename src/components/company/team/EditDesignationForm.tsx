import React from "react";
import { Icon } from "@blueprintjs/core";
import { ICompanyMembers } from "stores/company/Reducer";
import { Entity } from "stores/UtilsActions";
import { Form, Field } from "react-final-form";
import { IconNames } from "@blueprintjs/icons";
import SelectInput from "components/common/final-form/SelectInput";
import { required } from "components/common/final-form/utils";
import { Condition } from "components/common/final-form/Condition";
import TextInput from "components/common/final-form/TextInput";
import SubmitResetButtons from "components/common/final-form/SubmitResetButtons";
import Error from "components/common/final-form/Error";
interface EditDesignationFormProps {
	setShowDialogEdit: (val: boolean) => void;
}

interface EditDesignationFormInternalProps extends EditDesignationFormProps {
	member: ICompanyMembers | undefined;
	setShowDialogEdit: (val: boolean) => void;
	editDesignation: (values: any, memberId: string) => void;
	getCompanyMembers: () => void;
	divisions: Entity[];
	departments: Entity[];
}
export const EditDesignationForm = (
	props: EditDesignationFormInternalProps
) => {
	const onSubmit: any = async (values: any) => {
		if (props.member) {
			values.designation = props.member.designations[0]._id;
			const status: any = await props.editDesignation(values, props.member._id);
			if (status === 200) {
				await props.getCompanyMembers();
				props.setShowDialogEdit(false);
			}
		}
		return {};
	};

	const initialValues: any = () => {
		let divisions = ["director", "cxo"];
		if (props.member && props.member.designations.length) {
			if (divisions.includes(props.member.designations[0].division)) {
				return {
					division: props.member.designations[0].division,
					position: props.member.designations[0].position
				};
			} else {
				return {
					division: props.member.designations[0].division,
					department: props.member.designations[0].department._id,
					position: props.member.designations[0].position
				};
			}
		}
		return {};
	};

	return (
		<Form
			onSubmit={onSubmit}
			initialValues={initialValues}
			render={({ handleSubmit, form, submitting, pristine, values }) => (
				<div>
					<div className="flex justify-end pa3">
						<Icon
							icon={IconNames.DELETE}
							iconSize={20}
							className="grow pointer tigrow-lightBlue"
							onClick={(e: any) => props.setShowDialogEdit(false)}
						/>
					</div>
					<form className="fl w-100 pa4 pt0" onSubmit={handleSubmit}>
						<h1 className="f5 tigrow-lightBlue">Edit Role</h1>
						<div className="flex flex-column">
							<Field<string>
								name="division"
								component={SelectInput}
								validate={required}
							>
								<option selected value="">
									Please select a division
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
								match={[
									"seniorManager",
									"middleManager",
									"operationalEmployee"
								]}
							>
								<Field<string>
									name="department"
									component={SelectInput}
									validate={required}
								>
									<option selected value="">
										Please select a department
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
