import React from "react";
import { FieldRenderProps } from "react-final-form";
import { Icon, HTMLSelect } from "@blueprintjs/core";
import { Entity } from "stores/UtilsActions";

type Props = FieldRenderProps<string, any>;

const SelectInput = ({ input, meta, ...rest }: Props) => {
	let props: any = { ...rest };
	return (
		<>
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
							{props.placeHolder ? props.placeHolder : "Please select a value"}
						</option>
						{props[input.name] &&
							props[input.name].length &&
							props[input.name].map((d: Entity) => (
								<option value={d._id}>{d.name}</option>
							))}
					</HTMLSelect>
				</div>
			</div>
		</>
	);
};

export default SelectInput;
