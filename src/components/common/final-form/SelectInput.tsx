import React from "react";
import { FieldRenderProps } from "react-final-form";
import { Icon } from "@blueprintjs/core";
import { checkError } from "./utils";

type Props = FieldRenderProps<string, any>;

const SelectInput = ({ input, meta, ...rest }: Props) => {
	return (
		<>
			<div className={`${checkError(meta) ? "mt2 mb3" : "mb4"}`}>
				<div className="flex">
					<div
						className={`f5 pa1 bb ${
							checkError(meta) ? "b--red" : "b--lightBlue"
						}`}
					>
						<Icon
							icon={"comparison"}
							className={`${checkError(meta) ? "red" : "tigrow-lightBlue"}`}
						/>
					</div>
					<div
						className={`br0 ${
							checkError(meta) ? "bb b--red" : "bb b--lightBlue"
						} bp3-select bp3-fill bp3-minimal`}
					>
						<select
							{...input}
							{...rest}
							style={{
								boxShadow: "none",
								borderRadius: "0px",
								backgroundColor: "white",
								flex: "1",
								outline: "none"
							}}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default SelectInput;
