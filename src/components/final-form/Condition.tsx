import React from 'react';
import { Field } from 'react-final-form';

interface FormConditionProps {
	when: string;
	validate: (value: string) => boolean;
	children: JSX.Element;
}

export const Condition = (props: FormConditionProps) => (
	<Field name={props.when} subscription={{ value: true }}>
		{({ input: { value } }) => (props.validate(value) ? props.children : null)}
	</Field>
);
