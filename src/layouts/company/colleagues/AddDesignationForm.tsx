import React from 'react';
import { Icon } from '@blueprintjs/core';
import { Entity } from 'stores/UtilsActions';
import { Form, Field } from 'react-final-form';
import { required, checkError } from 'components/final-form/utils';
import { IconNames } from '@blueprintjs/icons';
import { SubmitAndResetButtons } from 'components/final-form/SubmitResetButtons';
import { Condition } from 'components/final-form/Condition';
import { ICompanyMembers } from 'stores/company/Reducer';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { DropdownFieldWithError } from 'components/fields/DropdownField';

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
							<div className="mb4">
								<Field<string>
									name="division"
									validate={required}
									render={({ input, meta }) =>
										<DropdownFieldWithError
											id={input.name}
											selectedValue={input.value}
											options={
												props.divisions && props.divisions.length > 0 ?
													props.divisions : [] as any
											}
											onChange={input.onChange}
											leftIcon="id-number"
											error={checkError(meta) && (meta.error || meta.submitError)}
										/>
									}
								/>
							</div>
							<Condition
								when="division"
								validate={(value => {
									return [
										'seniorManager',
										'middleManager',
										'operationalEmployee'
									].includes(value);
								})}
							>
								<div className="mb4">
									<Field<string>
										name="department"
										validate={required}
										render={({ input, meta }) =>
											<DropdownFieldWithError
												id={input.name}
												selectedValue={input.value}
												options={
													props.departments &&
														props.departments.length > 0 ?
														props.departments : [] as any
												}
												onChange={input.onChange}
												leftIcon="comparison"
												error={checkError(meta) && (meta.error || meta.submitError)}
											/>
										}
									/>
								</div>
							</Condition>
						</div>
						<Field<string>
							name="position"
							validate={required}
							render={({ input, meta }) =>
								<InputGroupFieldWithError
									id={input.name}
									className={`br0 ${checkError(meta) ? 'bb b--red' : 'bb b--lightBlue'}`}
									placeHolder="Position"
									value={input.value}
									onChange={input.onChange}
									leftIcon="id-number"
									leftIconColor={`${checkError(meta) ? 'red' : '#0fa3a3'}`}
									style={{ boxShadow: 'none' }}
									error={checkError(meta) && (meta.error || meta.submitError)}
								/>
							}
						/>
						<SubmitAndResetButtons
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
