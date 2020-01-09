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

  const createInnerElement: any = (id: string) => {
    const innerContainer = document.createElement('div');
    innerContainer.setAttribute('id', id);
    return innerContainer;
  };

  useEffect(() => {
    const rightSidebar: HTMLElement | null = document.getElementById('rightSidebar');
    // t.appendChild(createInnerElement('inner--right-sidebar'))
    setTarget(rightSidebar);

    const innerRightSidebar: HTMLElement | null = document.getElementById('inner--right-sidebar');

    if (innerRightSidebar) {
      innerRightSidebar.remove();
    }

  }, []);

  return target !== null && props.rightSidebarOpen ?
    createPortal(props.children, target.appendChild(createInnerElement('inner--right-sidebar'))) : null;
};

const mapStateToProps = (state: any) => {
  return {
    rightSidebarOpen: state.layoutReducer.rightSidebar.open
  };
};

export const RightSidebar = connect(mapStateToProps, { setRightSidebar })(withRouter(RightSidebarComponent));