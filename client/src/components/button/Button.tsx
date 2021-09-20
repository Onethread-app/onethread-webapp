import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';

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
  white?: boolean;
  bold?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

export const OTButton = (props: IOTButton) => {
  let styles = {
    minWidth: '266.55px',
    background: props.white ? '#fff' : '#3484f0',
    borderRadius: '10px',
    padding: '1.15rem 2.4rem',
    border: 'none',
    color: props.white ? '#3484f0' : '#fff',
    textAlign: 'center' as 'center',
    fontWeight: props.bold ? 700 : 500,
    fontSize: props.white ? '24px' : '20px',
    lineHeight: props.white ? '29px' : '24px',

    '&:hover': {
      cursor: 'pointer',
    },
  };
  useEffect(() => {
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

export const CreateCompany = () => {
  const Button = styled.button`
    border: 1.5px solid #0e0c4d;
    box-sizing: border-box;
    border-radius: 5px;
    padding: 14px 0;
    text-align: center;
    cursor: pointer;
    width: 100%;
    font-weight: 500;
    font-size: 16.376px;
    line-height: 20px;
    background: #ffffff;
    color: #34b3e9;
  `;
  return <Button>Create Company</Button>;
};
