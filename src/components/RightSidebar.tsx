import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { setRightSidebar } from 'stores/layout/Actions';
import { createPortal } from 'react-dom';

interface RightSidebarProps {
  children: JSX.Element;
  open: boolean;
}
interface RightSidebarInternalProps extends RightSidebarProps, RouteComponentProps {
  setRightSidebar: (data: boolean) => void;
  rightSidebarOpen: boolean;

}

const RightSidebarComponent = (props: RightSidebarInternalProps) => {
  useEffect(() => {
    props.setRightSidebar(props.open);
  }, [props.open]);

  const [target, setTarget] = useState<HTMLElement | null>(null);

  const createRootElement: any = (id: string) => {
    const rootContainer = document.createElement('div');
    rootContainer.setAttribute('id', id);
    return rootContainer;
  };

  useEffect(() => {
    setTarget(document.getElementById('rightSidebar'));
    if (target && target.children.length) {
      while (target.firstChild) {
        target.removeChild(target.firstChild);
      }
    }
  }, []);

  return target !== null && props.rightSidebarOpen ? createPortal(props.children, target) : null;
};

const mapStateToProps = (state: any) => {
  return {
    rightSidebarOpen: state.layoutReducer.rightSidebar.open
  };
};

export const RightSidebar = connect(mapStateToProps, { setRightSidebar })(withRouter(RightSidebarComponent));