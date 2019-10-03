import React from "react";
import {
	Button,
	Icon
} from "@blueprintjs/core";
import { ListItemViewWithRoundedImage } from "components/common/ListItemViewWithRoundedImage";
import user from "../../../../resources/images/user.png";

export const ChatLayout: React.SFC<{}> = () => (
	<div>
		<div className="relative">
			<div
				className="overflow-y-auto"
				style={{ height: "calc(100vh - 170px)" }}
			>
				<ListItemViewWithRoundedImage
					imageSrc={user}
					listDescription="asdasd asd asd asd ads "
				/>
			</div>
			<div className="fixed bottom-1 w-60 br3 shadow-3 dt pa1">
				<div className="dtc w2tigrow v-mid">
					<a className="dim ml2" href="#" title="User">
						<img src={user} className="v-mid w2 br-100" alt="user" />
					</a>
				</div>
				<textarea className="bp3-input dtc w-100 ma1"></textarea>
				<div className="w-15 dtc v-mid">
					<Button className="bp3-button bp3-minimal bp3-large">
						<Icon icon="media" style={{ color: "#0fa3a3" }} />
					</Button>
					<Button className="bp3-button bp3-minimal bp3-large">
						<Icon icon="link" style={{ color: "#0fa3a3" }} />
					</Button>
					<Button className="bp3-button bp3-minimal bp3-large">
						<Icon icon="insert" style={{ color: "#0fa3a3" }} />
					</Button>
				</div>
			</div>
		</div>
	</div>
);