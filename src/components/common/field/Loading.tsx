import * as React from 'react';
import { Spinner } from '@blueprintjs/core';

export const Loading = (props: {
  size?: number
}) => (
  <Spinner size={props.size} />
)