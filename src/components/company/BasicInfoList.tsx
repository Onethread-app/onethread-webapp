import * as React from 'react';
import { InfoListItem } from './InfoListItem';
import { InfoListItemIcon } from './InfolistItemIcon';
import { InfoListTitle } from './InfoListTitle';

export const BasicInfoList = () => {
  return (
   <>
    <div className="br3 bg-white h-auto pa4 mt3">
    <InfoListTitle
    listTitle="Basic Information"
    iconType="edit"
    />
      <InfoListItem
        listTitle="Email"
        listDescription="Julian Martha"
      />
      <InfoListItem
        listTitle="Secondary Email"
        listDescription="No secondary email has set"
      />
      <InfoListItemIcon
        listTitle="Contact Number"
        listDescription="+880-18421421"
        iconType="lock"
      />
      <InfoListItem
        listTitle="Address"
        listDescription="Mohakhali DOHS"
      />
      <InfoListItem
        listTitle="Gender"
        listDescription="Male"
      />
      <InfoListItem
        listTitle="Birthdate"
        listDescription="13th September, 2019"
      />
      <InfoListItem
        listTitle="Blood Group"
        listDescription="A+"
      />
      </div>
      </>
   
  )
}