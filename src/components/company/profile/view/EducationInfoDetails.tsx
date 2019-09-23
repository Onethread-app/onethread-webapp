import * as React from 'react';
import { ListTitleView } from './ListTitleView';
import { SectionViewWithTitleAndDesciption } from './ListItemView';

export const EducationInfoDetailsView = () => {
  return (
    <div className="br3 bg-white h-auto pa4 mt3">
      <ListTitleView
        listTitle="Educational Information"
        iconType="edit"
        onClick={()=> {return true}}
      />
      <SectionViewWithTitleAndDesciption
        listTitle="School"
        listDescription="Julian Martha"
      />
      <SectionViewWithTitleAndDesciption
        listTitle="College"
        listDescription="No secondary email has set"
      />
      <SectionViewWithTitleAndDesciption
        listTitle="University"
        listDescription="A+"
      />
    </div>
  )
}