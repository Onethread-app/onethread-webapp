import React from 'react';
import { notificationType } from './rule';
import { Link } from 'react-router-dom';

export default function index(props: any) {
  return (
    <main className='mw6 center'>
      <article className='dt w-100 pb2 mt2'>
        <div style={{ width: '20px' }} className=''>
          {props.type && (
            <img src={notificationType[props.type].img} className='h2' />
          )}
        </div>
        <Link
          to={notificationType[props.type].path}
          className='dtc v-mid p10 pl2 link dim black hide-child pointer'
        >
          <p className='f6 mv0'>{props.text} </p>
        </Link>
      </article>
    </main>
  );
}
