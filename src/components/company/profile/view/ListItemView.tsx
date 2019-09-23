import * as React from 'react';
import { Icon } from '@blueprintjs/core';

interface InfoListItemProps {
  listTitle: string;
  listDescription: string;
}

export const SectionViewWithTitleAndDesciption = (props: InfoListItemProps) => (
  <div className="br3 bg-white h-auto">
    <h1 className="f6 lh-copy">{props.listTitle}</h1>
    <p>{props.listDescription}</p>
  </div>
)

interface InfoListItemIocnProps {
  listTitle: string;
  listDescription: string;
  iconType: any; 
}

export const ListItemViewWithIcon = (props: InfoListItemIocnProps) => (
  <div className="br3 bg-white h-auto">
  <div className="cf dib">
    <h1 className="f6 lh-copy">{props.listTitle}</h1>
    <p>{props.listDescription}</p>
  </div>
  <Icon className="fr mv4 " icon={props.iconType} />
</div>
)