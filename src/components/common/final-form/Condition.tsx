import React from "react";
import { Field } from "react-final-form";

interface props {
	when: any;
	validate: (value: any) => boolean;
	children: any;
}

export const Condition = ({ when, validate, children }: props) => {
	return (
		<>
			<Field name={when} subscription={{ value: true }}>
				{({ input: { value } }) => (validate(value) ? children : null)}
			</Field>
		</>
	);
};
