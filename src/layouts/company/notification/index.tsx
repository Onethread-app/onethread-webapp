import React from 'react';
import { notificationType } from './rule';

export default function index(props: any ) {
  return (
    <main className="mw6 center">
      <article className="dt w-100 pb2 mt2">
        <div className="">
          <img src={notificationType[props.type].img} className=" h2" />
        </div>
        <div className="dtc v-mid p10 pl2">
          <h6 className="f4 mv0">{props.text} </h6>
        </div>
      </article>
    </main>

  );
}
