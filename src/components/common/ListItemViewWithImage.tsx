import * as React from 'react';

interface CompanyListItemProps {
  imageSrc: string;
  listTitle: string;
  listDescription: string;
  onClick?: () => void;
}

export const ListItemViewWithImage = (props: CompanyListItemProps) => (
  <article
    className="dt w-100 pb2 mt2 pointer"
    onClick={props.onClick ? props.onClick : () => null}
  >
    <div className="dtc w1 w2-ns v-mid">
      <img src={props.imageSrc} className="ba b--black-10 db w1 w2-ns h1 h2-ns br3" />
    </div>
    <div className="dtc v-mid pl3">
      <h1 className="f7 f6-ns fw4 lh-title black mv0">{props.listTitle}</h1>
      <h2 className="f6 fw3 mt0 mb0 black-60">{props.listDescription}</h2>
    </div>
  </article>
)

