import * as React from 'react';

interface CompanyListItemDetailsProps {
  imageSrc: string;
  listTitle: string;
  listSubtitle: string;
  listDescription: string
}

export const ListItemViewWithDetails = (props: CompanyListItemDetailsProps) => (
  <>
    <article
      className="flex w-80 mt2 items-center"
    >
      <div className="" style={{ minWidth: "35px", maxWidth: "35px" }}>
        <img src={props.imageSrc} />
      </div>

      <div className="ml2 bg-white" style={{ width: "auto" }}>
        <h2 className="f6 fw3 mt0 mb0 tj">{props.listTitle}</h2>
        <h3 className="f6 fw3 mt0 mb0 tj">{props.listSubtitle}</h3>
      </div>
    </article>
    <p className="f6 fw3 mt0 mb0">{props.listDescription}</p>
  </>
)