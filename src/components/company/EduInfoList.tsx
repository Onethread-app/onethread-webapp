import * as React from 'react';
import { InfoListItem } from './InfoListItem';
import { InfoListTitle } from './InfoListTitle';

export const EduInfoList = () => {
  return (
    <div className="br3 bg-white h-auto pa4 mt3">
      <InfoListTitle
        listTitle="Educational Information"
        iconType="edit"
      />
      <InfoListItem
        listTitle="School"
        listDescription="Julian Martha"
      />
      <InfoListItem
        listTitle="College"
        listDescription="No secondary email has set"
      />
      <InfoListItem
        listTitle="University"
        listDescription="A+"
      />
    </div>
  )
}