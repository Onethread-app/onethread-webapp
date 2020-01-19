import * as React from 'react';
import { Icon, Breadcrumbs, Breadcrumb } from '@blueprintjs/core';
import { Link, withRouter, RouteComponentProps } from 'react-router-dom';

interface BreadCrumbsItemProps {
  text: string;
  href: string;
}

interface BreadCrumbsProps {
  items: BreadCrumbsItemProps[];
}

export const BreadCrumbs = withRouter((props: BreadCrumbsProps & RouteComponentProps) => (
  <>
    <Icon
      className="pointer mr2 mt1 black-70"
      icon={'circle-arrow-left'}
      iconSize={26}
      onClick={e => {
        props.history.push(props.items[props.items.length - 2].href);
      }}
    />
    <Breadcrumbs
      items={props.items}
      breadcrumbRenderer={e => (
        <Link to={e.href!}>
          <Breadcrumb
            text={e.text}
            className="pointer f7 black fw6"
          />
        </Link>
      )}
    />
  </>
));