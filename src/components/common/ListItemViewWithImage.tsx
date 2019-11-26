import * as React from 'react';

interface CompanyListItemProps {
  class?: string;
  active?: boolean;
  imageSrc: boolean;
  listTitle: string;
  role?: string;
  onClick?: () => void;
}

export const ListItemViewWithImage = (props: CompanyListItemProps) => (
  <article
    className={`dt w-100 ${props.class !== "" ? props.class : "pb2"} ${props.active ? "bg-black-10" : ""} mt2 pointer bp3-popover-dismiss`}
    onClick={props.onClick ? props.onClick : () => null}
  >
    <div className={`mr1 br-100
    ${props.imageSrc ? "bg-green" : "bg-red"}`}
      style={{ width: "10px", height: "10px", marginTop: "12px" }}
    ></div>
    <div className="dtc v-mid pl3">
      <h1 className="f7 f6-ns fw4 lh-title black mv0 ws-break">{props.listTitle} </h1>
      <h2 className="f6 fw3 mt0 mb0 black-60 ws-break">{`Role: ${props.role}`}</h2>
    </div>
  </article>
)

