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
    <main className={`mw6 center pv1 ba b--near-white`}>
      <article className="flex items-center dt w-100 pl3 ">
        <div style={{ width: '20px' }}>
          {props.type && (
            <img
              src={notificationType[props.type].img}
              className="h2"
            />
          )}
        </div>
        <div className="w-90 dtc v-mid p10 pl2 pb2 link dim black hide-child pointer">
          <p
            className={`tl f6 lh-copy mv0 ${
              props.read ? 'gray' : 'black'
            }`}
          >
            {props.text}{' '}
          </p>
        </div>
      </article>
    </main>
  );
}
