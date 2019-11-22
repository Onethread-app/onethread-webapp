import React from "react";
import { checkError } from "./utils";
import { Field } from "react-final-form";

interface ErrorPros {
	name: any;
}

const Error = (props: ErrorPros) => (
	<Field
		name={props.name}
		subscription={{
			touched: true,
			error: true,
			submitError: true,
			dirtySinceLastSubmit: true
		}}
		render={({ meta }) =>
			checkError(meta) && (
				<small style={{ color: "red" }}>{meta.error || meta.submitError}</small>
			)
		}
	/>
);

export default Error;
