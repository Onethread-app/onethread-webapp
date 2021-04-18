import React from 'react';

export const componentDecorator = (href, text, key) => (
  <a href={href} key={key} target="_blank">
    {text}
  </a>
);
