import React from "react";
import { Field } from "react-final-form";

interface props {
	when: any;
	match: any[];
	children: any;
}

export const Condition = ({ when, match, children }: props) => {
	return (
		<>
			<Field name={when} subscription={{ value: true }}>
				{({ input: { value } }) => (match.includes(value) ? children : null)}
			</Field>
		</>
	);
};
