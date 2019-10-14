import * as React from 'react';
import { Icon, Divider } from '@blueprintjs/core';

interface InfoListTitleProps {
  listTitle: string;
  onClick: any;
  iconType: any;
}

export const ListTitleView = (props: InfoListTitleProps) => {
  return (
    <>
      <div className="cf ">
        <h1 className="f5 lh-copy dib tigrow-lightGray-1">{props.listTitle}</h1>
        <Icon className="fr mv3 tigrow-lightBlue pointer" icon={props.iconType} onClick={props.onClick} />
      </div>
      <Divider />
      
    </>
  )
}

