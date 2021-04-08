import React from 'react';
import { Button } from '@blueprintjs/core';
import { Link } from 'react-router-dom';

interface IButtonProps {
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  to?: string;
  mid?: boolean;
  extraClasses?: string;
  children?: any;
  style?: any;
}

export const TiButton = ({
  to,
  mid,
  extraClasses,
  children,
  style,
  onClick,
}: IButtonProps) => {
  let classes = 'bp3-minimal br2 f4-ns fw6 pa4-l pa2 mv4-ns mv2';
  const defaultStyles = {
    color: 'white',
    backgroundColor: '#4B6BC8',
  };
  if (mid) {
    classes = 'f4-l f5-m f7 fw6-ns bp3-minimal pa3 br2 mv3';
  }

  if (extraClasses) {
    classes = `${classes} ${extraClasses}`;
  }

  if (to) {
    return (
      <Link to={to}>
        <Button
          className={classes}
          style={style ? style : defaultStyles}
        >
          {children}
        </Button>
      </Link>
    );
  } else {
    return (
      <Button
        className={classes}
        onClick={onClick}
        style={style ? style : defaultStyles}
      >
        {children}
      </Button>
    );
  }
};

interface IOTButton {
  to?: string;
  style?: any;
  classes?: any;
  children?: any;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

export const OTButton = (props: IOTButton) => {
  let styles = {
    width: '266.55px',
    background: '#3484f0',
    borderRadius: '10px',
    padding: '1.15rem 8px',
    border: 'none',
    color: '#fff',
    textAlign: 'center' as 'center',
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '24px',

    '&:hover': {
      cursor: 'pointer',
    },
  };

  React.useEffect(() => {
    if (props.style) {
      styles = { ...styles, ...props.style };
    }
  }, [props.style]);

  if (props.to) {
    return (
      <Link to={props.to}>
        <Button style={styles}>{props.children}</Button>
      </Link>
    );
  } else {
    return (
      <Button onClick={props.onClick} style={styles}>
        {props.children}
      </Button>
    );
  }
};
