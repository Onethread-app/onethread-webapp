import React from "react";
import { FieldRenderProps } from "react-final-form";
import { checkError } from "components/common/final-form/utils";
import { InputGroupField } from "../field/InputGroup";

type Props = FieldRenderProps<string, any>;

const TextInput: React.FC<Props> = ({ input, meta, ...rest }: Props) => {
	return (
		<>
			<div className={` ${checkError(meta) ? "mt2 mb3" : "mt1 mb4"}`}>
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
			</div>
		</>
	);
};

export default TextInput;
