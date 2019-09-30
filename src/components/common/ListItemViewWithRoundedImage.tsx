
import * as React from 'react';

interface CompanyListItemProps {
  imageSrc: string;
  listDescription: string;
}

export const ListItemViewWithRoundedImage = (props: CompanyListItemProps) => (
  <article
    className="flex w-80 mt2 items-center"
  >
    <div className="" style={{minWidth:"35px"}}>
      <img src={props.imageSrc} className=" br3" />
    </div>
    <div className="pa3 ml2 bg-white br3 " style={{width:"auto"}}>
      <h2 className="f6 fw3 mt0 mb0 black-60 tj">{props.listDescription}</h2>
    </div>
  </article>
)