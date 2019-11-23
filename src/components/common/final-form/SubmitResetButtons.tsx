import React from "react";
import { Button } from "@blueprintjs/core";

interface Props {
	reset: (initialValues?: object | undefined) => void;
	submitting: boolean;
	pristine: boolean;
	resetBtnName: string;
	submitBtnName: string;
}

const SubmitResetButtons = ({
	reset,
	submitting,
	pristine,
	resetBtnName,
	submitBtnName
}: Props) => {
	return (
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
				onClick={reset}
				disabled={submitting || pristine}
			>
				{resetBtnName}
			</Button>
			<Button
				className="grow h2 pointer white bp3-minimal w4"
				style={{
					background: "#0fa3a3",
					outline: "none",
					color: "white"
				}}
				loading={submitting}
				type="submit"
				disabled={submitting || pristine}
			>
				{submitBtnName}
			</Button>
		</div>
	);
};

export default SubmitResetButtons;
