import React from 'react';
import { Button } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { createRoomAction } from 'stores/room/Actions';
import { Form, Field } from 'react-final-form';
import { required, composeValidators, maxValue } from 'components/final-form/utils';
import { InputGroupFieldWithError } from 'components/fields/InputGroupField';
import { checkError } from 'components/final-form/utils';

// tslint:disable-next-line: no-var-requires
const { withChatkit } = require('@pusher/chatkit-client-react');

interface ICreateFormProps {
	setShowDialog: (val: boolean) => void;
}

interface ICreateFormInternalProps extends ICreateFormProps {
	chatkit?: any;
	createRoomAction: (val: any) => void;
}

const CreateFormComponent: React.FC<any> = withChatkit((props: ICreateFormInternalProps) => {

	const onSubmit: any = async (values: any) => {
		const status: any = await props.createRoomAction(values);
		if (status === 409) {
			return { name: 'Duplicate name' };
		} else if (status === 201) {
			if (!props.chatkit.isLoading) {
				props.setShowDialog(false);
			}
		}
		return {};
	};

	return (
		<Form
			onSubmit={onSubmit}
			initialValues={{ name: '' }}
			render={({ handleSubmit, submitting, pristine }) => (
				<>
					<form className="fl w-100 pa4 pt0 mt4" onSubmit={handleSubmit}>
						<h1 className="f5 tigrow-lightBlue">Create Room</h1>
						<Field<string>
							name="name"
							validate={composeValidators(required, maxValue(20))}
							render={({ input, meta }) =>
								<InputGroupFieldWithError
									id={input.name}
									autoFocus={true}
									className={`br0 ${checkError(meta) ? 'bb b--red' : 'bb b--lightBlue'}`}
									placeHolder="Room name"
									value={input.value}
									onChange={input.onChange}
									leftIcon="layout-balloon"
									leftIconColor={`${checkError(meta) ? 'red' : '#0fa3a3'}`}
									style={{ boxShadow: 'none' }}
									error={checkError(meta) && (meta.error || meta.submitError)}
								/>
							}
						/>
						<div className="flex justify-end mt4">
							<Button
								className="grow h2 pointer white bp3-minimal w4 mr3"
								style={{
									background: '#fff',
									outline: 'none',
									border: '1px solid #0fa3a3',
									color: '#0fa3a3'
								}}
								onClick={() => props.setShowDialog(false)}
							>
								Cancel
							</Button>
							<Button
								className="grow h2 pointer white bp3-minimal w4"
								style={{
									background: '#0fa3a3',
									outline: 'none',
									color: 'white'
								}}
								loading={submitting}
								type="submit"
								disabled={submitting || pristine}
							>
								Create
							</Button>
						</div>
					</form>
				</>
			)}
		/>
	);
});

export const CreateForm = connect(null, {
	createRoomAction
})(CreateFormComponent);
