import { useEffect, useState } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { connect } from 'react-redux';

import { setRightSidebar } from 'stores/layout/Actions';

interface IRightSidebarProps {
  children: JSX.Element;
  onClose: () => void;
}
interface IRightSidebarInternalProps
  extends IRightSidebarProps,
    RouteComponentProps {
  setRightSidebar: (data: boolean) => void;
  rightSidebarOpen: boolean;
}

const RightSidebarComponent = (props: IRightSidebarInternalProps) => {
  const [target, setTarget] = useState<HTMLElement | null>(null);

  const createInnerElement: any = (
    idName: string,
    className: string = '',
  ) => {
    const innerContainer = document.createElement('div');
    innerContainer.setAttribute('id', idName);
    innerContainer.setAttribute('class', className);
    return innerContainer;
  };

  // const clearInnerElement = () => {
  // const innerRightSidebar: HTMLElement | null = document.getElementById('inner--right-sidebar');
  // if (innerRightSidebar) {
  //   innerRightSidebar.remove();
  // }
  // };

  const clear = () => {
    const myNode: HTMLElement | null = document.getElementById(
      'rightSidebar',
    );
    while (myNode && myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
  };

  const checkClickOutside = (e: any) => {
    const mainLayout: HTMLElement | null = document.getElementById(
      'main-layout',
    );

    if (mainLayout && e.target === mainLayout) {
      props.onClose();
      clear();
      props.setRightSidebar(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', checkClickOutside);
    return () => {
      document.removeEventListener('click', checkClickOutside);
    };
  });

  useEffect(() => {
    props.setRightSidebar(true);
    const rightSidebar: HTMLElement | null = document.getElementById(
      'rightSidebar',
    );
    setTarget(rightSidebar);

    return () => {
      clear();
      props.setRightSidebar(false);
    };
  }, []);

  return target !== null && props.rightSidebarOpen
    ? createPortal(
        props.children,
        target.appendChild(
          createInnerElement(
            'inner--right-sidebar',
            'h-100 overflow-y-auto',
          ),
        ),
      )
    : null;
};

const mapStateToProps = (state: any) => {
  return {
    rightSidebarOpen: state.layoutReducer.rightSidebar.open,
  };
};

export const RightSidebar = connect(mapStateToProps, {
  setRightSidebar,
})(withRouter(RightSidebarComponent));
