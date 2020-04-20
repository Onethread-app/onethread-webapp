import React from 'react';
import { notificationType } from './rule';
// import { Link } from 'react-router-dom';
// import { store } from 'Store';

interface notification {
  type: string;
  text: string;
  read: string;
}

export default function index(props: notification) {
  return (
    <main
      className={`mw6 center pv1 ${
        props.read ? 'bg-near-white' : ''
      } ba b--near-white`}
    >
      <article className="dt w-100 p2 pl2">
        <div style={{ width: '20px' }}>
          {props.type && (
            <img
              src={notificationType[props.type].img}
              className="h2"
            />
          )}
        </div>
        <div className="dtc v-mid p10 pl2 link dim black hide-child pointer">
          <p className="f6 lh-copy mv0">{props.text} </p>
        </div>
      </article>
    </main>
  );
}
