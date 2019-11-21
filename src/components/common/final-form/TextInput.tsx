import React from "react";
import { FieldRenderProps } from "react-final-form";
import { checkError } from "helpers/final-form";
import { InputGroupField } from "../field/InputGroup";

type Props = FieldRenderProps<string, any>;

const TextInput: React.FC<Props> = ({ input, meta, ...rest }: Props) => {
	return (
		<>
			<div className={` ${checkError(meta) ? "mb3" : "mb4"}`}>
				<div className="">
					<InputGroupField
						{...input}
						{...rest}
						id={input.name}
						leftIconColor={`${checkError(meta) ? "red" : "#0fa3a3"}`}
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
	);
};

export default TextInput;
