import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { setRightSidebar, toggleRightSidebar } from 'stores/layout/Actions';
import { createPortal, findDOMNode } from 'react-dom';

interface RightSidebarProps {
  children: JSX.Element;
  open: boolean;
  onClose: () => void;
}
interface RightSidebarInternalProps extends RightSidebarProps, RouteComponentProps {
  setRightSidebar: (data: boolean) => void;
  toggleRightSidebar: () => void;
  rightSidebarOpen: boolean;
}

const RightSidebarComponent = (props: RightSidebarInternalProps) => {

  const [target, setTarget] = useState<HTMLElement | null>(null);

  const createInnerElement: any = (id: string) => {
    const innerContainer = document.createElement('div');
    innerContainer.setAttribute('id', id);
    return innerContainer;
  };

  const clearInnerElement = () => {
    const innerRightSidebar: HTMLElement | null = document.getElementById('inner--right-sidebar');
    if (innerRightSidebar) {
      innerRightSidebar.remove();
    }
  };

  const checkClickOutside = (e: any) => {
    if (e.target.id !== 'rightSidebar') {
      props.onClose();
      clearInnerElement();
      props.setRightSidebar(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', checkClickOutside);
    return () => {
      document.removeEventListener('click', checkClickOutside);
    };
  });

  // TODO remove open props
  useEffect(() => {
    props.setRightSidebar(props.open);
  }, [props.open]);

  useEffect(() => {
    const rightSidebar: HTMLElement | null = document.getElementById('rightSidebar');
    setTarget(rightSidebar);
    return () => {
      clearInnerElement();
      props.setRightSidebar(false);
    };
  }, []);

  return target !== null && props.rightSidebarOpen ?
    createPortal(props.children, target.appendChild(createInnerElement('inner--right-sidebar'))) : null;
};

const mapStateToProps = (state: any) => {
  return {
    rightSidebarOpen: state.layoutReducer.rightSidebar.open
  };
};

export const RightSidebar = connect(mapStateToProps, {
  setRightSidebar, toggleRightSidebar
})(withRouter(RightSidebarComponent));