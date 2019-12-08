import React from "react";
import { Button } from "@blueprintjs/core";

interface SubmitAndResetButtonsProps {
	reset: (initialValues?: object | undefined) => void;
	submitting: boolean;
	pristine: boolean;
	resetBtnName: string;
	submitBtnName: string;
}

export const SubmitAndResetButtons = (props: SubmitAndResetButtonsProps) => (
	<div className="flex justify-end mt4">
		<Button
			icon="refresh"
			className="grow h2 pointer white bp3-minimal w4 mr3"
			style={{
				background: "#fff",
				outline: "none",
				border: "1px solid #0fa3a3",
				color: "#0fa3a3"
			}}
			onClick={props.reset}
			disabled={props.submitting || props.pristine}
		>
			{props.resetBtnName}
		</Button>
		<Button
			className="grow h2 pointer white bp3-minimal w4"
			style={{
				background: "#0fa3a3",
				outline: "none",
				color: "white"
			}}
			loading={props.submitting}
			type="submit"
			disabled={props.submitting || props.pristine}
		>
			{props.submitBtnName}
		</Button>
	</div>
);
