import React, { useState } from "react";
import {
	Tab,
	Tabs,
	InputGroup,
	Button,
	Icon
} from "@blueprintjs/core";
import { ChatLayout } from './chats/ChatLayout';
import { TaskLayout } from './tasks/TaskLayout';
interface RightLayoutProps {
}
export const RightLayout = (props: RightLayoutProps) => {
	const [activePanelOnly] = useState(false);
	const [animate] = useState(true);
	const [vertical] = useState(false);

	return (
		<div className="flex flex-column">
			<div className="flex mt2">
				<p className="f4 fw7 mv1">General</p>
				<div className="flex">
					<InputGroup
						leftIcon="search"
						placeholder="search in conversations"
						className="ma1"
					/>
					<Button
						className="bp3-minimal ma1 outline-0 grow"
						style={{ background: "#0fa3a3" }}
					>
						<Icon
							icon="cog"
							style={{ background: "#0fa3a3", color: "white" }}
						/>
					</Button>
					<Button
						className="bp3-minimal ma1 outline-0 grow"
						style={{ background: "#B7B7B7" }}
					>
						<Icon
							icon="notifications"
							style={{ background: "#B7B7B7", color: "white" }}
						/>
					</Button>
					<Button
						className="bp3-minimal ma1 outline-0 grow"
						style={{ background: "#F55B7F" }}
					>
						<Icon
							icon="new-person"
							style={{ background: "#F55B7F", color: "white" }}
						/>
					</Button>
				</div>
			</div>
			<Tabs
				animate={animate}
				id="TabsExample"
				key={vertical ? "vertical" : "horizontal"}
				renderActiveTabPanelOnly={activePanelOnly}
				vertical={vertical}
			>
				<Tab
					id="ch"
					title="Chat"
					panel={<ChatLayout />}
					panelClassName="task-panel"
				/>
				<Tab
					id="ta"
					title="Task"
					panel={<TaskLayout />}
					panelClassName="task-panel"
				/>
				<Tabs.Expander />
			</Tabs>
		</div>
	);
};
