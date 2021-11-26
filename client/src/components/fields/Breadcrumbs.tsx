import { withRouter, RouteComponentProps } from 'react-router-dom';

interface BreadCrumbsItemProps {
  text: string;
  href: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

interface BreadCrumbsProps {
  items: BreadCrumbsItemProps[];
}

export const BreadCrumbs = withRouter(
  (props: BreadCrumbsProps & RouteComponentProps) => (
    <div className="cf"></div>
  ),
);
