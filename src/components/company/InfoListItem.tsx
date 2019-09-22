import * as React from 'react';

interface InfoListItemProps {
  listTitle: string;
  listDescription: string;
}

export const InfoListItem = (props: InfoListItemProps) => (
  <div className="br3 bg-white h-auto">
    <h1 className="f6 lh-copy">{props.listTitle}</h1>
    <p>{props.listDescription}</p>
  </div>
)