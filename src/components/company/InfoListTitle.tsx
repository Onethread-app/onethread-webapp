import * as React from 'react';
import { Icon, Divider } from '@blueprintjs/core';


interface InfoListTitleProps {
  listTitle: string;
  iconType: any;
}

export const InfoListTitle = (props: InfoListTitleProps) => {
  return (
    <>
      <div className="cf ">
        <h1 className="f5 lh-copy dib">{props.listTitle}</h1>
        <Icon className="fr mv3 tigrow-lightBlue" icon={props.iconType} />
      </div>
      <Divider />
    </>
  )
}

