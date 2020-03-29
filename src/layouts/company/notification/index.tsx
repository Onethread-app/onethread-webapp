import React from 'react';
import { notificationType } from './rule';
// import { Link } from 'react-router-dom';
// import { store } from 'Store';

interface notification {
  type: string;
  text: string;
}

export default function index(props: notification) {
  return (
    <main className="mw6 center">
      <article className="dt w-100 pb2 mt2">
        {/* {console.log(
          'notification',
          store.getState().companyReducer.currentCompany.name
        )} */}
        <div style={{ width: '20px' }} className="">
          {props.type && (
            <img src={notificationType[props.type].img} className="h2" />
          )}
        </div>
        <div
          // to={notificationType[props.type].path(store)}
          className="dtc v-mid p10 pl2 link dim black hide-child pointer"
        >
          <p className="f6 mv0">{props.text} </p>
        </div>
      </article>
    </main>
  );
}
