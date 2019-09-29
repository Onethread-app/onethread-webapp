import React from "react";
import { ButtonGroup, Alignment, Button, Intent } from "@blueprintjs/core";
import { Link, withRouter } from "react-router-dom";

interface SidebarLinksProps {
	parentUrl: string;
}

const DefaultSidebarLinks = () => (
	<>
		<Link to="/">
			<Button className="mv2" icon="user">
				Profile
						</Button>
		</Link>
	</>
)

const CompanySidebarLinks = (props: SidebarLinksProps) => (
	<>
		<Link to={`/workplace`} >
			<Button className="mv2" icon="control">
				Workplace
						</Button>
		</Link>
		<Link to={`/${props.parentUrl}`} >
			<Button className="mv2" icon="layout-auto">
				Profile
						</Button>
		</Link>
		<Link to={`/${props.parentUrl}/profile`} >
			<Button className="mv2" intent={Intent.PRIMARY} icon="briefcase">
				Create Workplace
						</Button>
		</Link>
	</>
)

const WorkPlaceSidebarLinks = (props: SidebarLinksProps) => (
	<>
		<Link to={`/${props.parentUrl}`}>
			<Button className="mv2" icon="control">
				Feed
						</Button>
		</Link>
		<Link to={`/${props.parentUrl}/room`} >
			<Button className="mv2" icon="layout-auto">
				Room
						</Button>
		</Link>
		<Link to={`/${props.parentUrl}/task`} >
			<Button className="mv2" icon="briefcase">
				Task
						</Button>
		</Link>
		<Link to={`/${props.parentUrl}/team`} >
			<Button className="mv2" icon="people">
				Team
						</Button>
		</Link>
	</>
)

const SidebarComponent = (props: any) => {
	const dynamicSidebar = () => {
		let url = props.match.url.split('/');

		switch (url[1]) {
			case 'company':
				return <CompanySidebarLinks parentUrl={'company'} />
			case 'workplace':
				return <WorkPlaceSidebarLinks parentUrl={'workplace'} />
			default:
				return <DefaultSidebarLinks />
		}
	}

	return (
		<div className="fixed bg-white w3 w6-m w11-l pt6 vh-100 br b--tigrowLightGray-1">
			<ButtonGroup
				alignText={Alignment.LEFT}
				className="bp3-minimal bp3-vertical bp3-fill pl1"
			>
				{dynamicSidebar()}
			</ButtonGroup>
		</div>
	);
};

export const Sidebar = withRouter(SidebarComponent);