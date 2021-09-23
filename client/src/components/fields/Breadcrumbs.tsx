import {
  Link,
  withRouter,
  RouteComponentProps,
} from 'react-router-dom';

import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { Breadcrumb } from '@blueprintjs/core/lib/esm/components/breadcrumbs/breadcrumb';
import { Breadcrumbs } from '@blueprintjs/core/lib/esm/components/breadcrumbs/breadcrumbs';

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
    <div className='cf'>
      <div className='fl'>
        <Icon
          className='pointer mr2 mt1 black-70'
          icon='circle-arrow-left'
          iconSize={26}
          onClick={(e) => {
            props.history.push(
              props.items[props.items.length - 2].href,
            );
          }}
        />
      </div>
      <div className='fl'>
        <Breadcrumbs
          items={props.items}
          minVisibleItems={props.items.length}
          breadcrumbRenderer={(e) => (
            <Link to={e.href!}>
              <Breadcrumb
                onClick={e.onClick}
                text={e.text}
                className='pointer f7 black fw6 hover-black'
              />
            </Link>
          )}
        />
      </div>
    </div>
  ),
);
