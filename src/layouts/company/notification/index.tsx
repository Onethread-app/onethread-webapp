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
          <h2 className="f6 f5-ns fw6 lh-title black mv0">Young Gatche </h2>
          <h3 className="f6 fw4 mt0 mb0 black-60">@yg</h3>
        </div>
      </article>
      <article className="dt w-100 pb2 mt2">
        <div className="">
          <img src="" className=" h2" />
        </div>
        <div className="dtc v-mid p8 pl2">
          <h2 className="f6 f5-ns fw6 lh-title black mv0">Young Gatchell </h2>
          <h3 className="f6 fw4 mt0 mb0 black-60">@yg</h3>
        </div>
      </article>
    </main>

  );
}
