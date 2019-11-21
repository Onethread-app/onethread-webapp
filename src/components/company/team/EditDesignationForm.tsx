import React from "react";
import { Icon, HTMLSelect, Button } from "@blueprintjs/core";
import { InputGroupField } from "components/common/field/InputGroup";
interface EditDesignationFormProps {
	setShowDialogEdit: (val: boolean) => void;
}

interface EditDesignationFormInternalProps extends EditDesignationFormProps {}
export const EditDesignationForm = (
	props: EditDesignationFormInternalProps
) => {
	const Division = ["ui", "ux", "frontend", "backend"];
	const Department = ["ui", "ux", "frontend", "backend"];
	return (
		<div>
			<div className="pa4">
				<h1 className="f5 tigrow-lightBlue">Edit Role</h1>
				<form className="">
					<h1 className="f7 black-40">#Role1</h1>
					<div className="flex justify-between">
						<div className="mb4">
							<div className="flex">
								<div className=" f5 pa1 bb b--lightBlue">
									<Icon icon={"comparison"} className="tigrow-lightBlue" />
								</div>
								<HTMLSelect
									fill={true}
									minimal={true}
									className=" bb b--lightBlue"
									style={{
										boxShadow: "none",
										borderRadius: "0px",
										backgroundColor: "white",
										flex: "1",
										outline: "none"
									}}
								>
									<option selected value="">
										Please select a division
									</option>
									{Division.map(t => (
										<option value={t}>{t}</option>
									))}
								</HTMLSelect>
							</div>
						</div>
						<div className="mb4">
							<div className="flex">
								<div className=" f5 pa1 bb b--lightBlue">
									<Icon icon={"comparison"} className="tigrow-lightBlue" />
								</div>
								<HTMLSelect
									fill={true}
									minimal={true}
									className=" bb b--lightBlue"
									style={{
										boxShadow: "none",
										borderRadius: "0px",
										backgroundColor: "white",
										flex: "1",
										outline: "none"
									}}
								>
									<option selected value="">
										Please select a department
									</option>
									{Department.map(t => (
										<option value={t}>{t}</option>
									))}
								</HTMLSelect>
							</div>
						</div>
					</div>
					<div className="mb1">
						<div className="flex">
							<InputGroupField
								value=""
								id="position"
								placeHolder="Position"
								leftIcon="id-number"
								style={{
									boxShadow: "none"
								}}
								className="bb b--lightBlue"
								leftIconColor="#0fa3a3"
							/>
						</div>
					</div>
					<div className="flex justify-end mt4">
						<Button
							className="w4 grow h2 pointer mr3"
							style={{
								background: "#fff",
								outline: "none",
								border: "1px solid #0fa3a3",
								color: "#0fa3a3"
							}}
							onClick={(e: any) => {
								e.preventDefault();
								props.setShowDialogEdit(false);
							}}
						>
							cancel
						</Button>
						<Button
							type="submit"
							className="w4 grow h2 pointer"
							style={{
								background: "#0fa3a3",
								outline: "none",
								color: "white"
							}}
							onClick={(e: any) => {
								e.preventDefault();
							}}
						>
							Save
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};
