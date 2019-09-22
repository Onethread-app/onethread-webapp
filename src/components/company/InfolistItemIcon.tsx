import * as React from 'react';
import { Icon } from '@blueprintjs/core';

interface InfoListItemIocnProps {
  listTitle: string;
  listDescription: string;
  iconType: any; 
}

export const InfoListItemIcon = (props: InfoListItemIocnProps) => (
  <div className="br3 bg-white h-auto">
  <div className="cf dib">
    <h1 className="f6 lh-copy">{props.listTitle}</h1>
    <p>{props.listDescription}</p>
  </div>
  <Icon className="fr mv4 " icon={props.iconType} />
</div>
)