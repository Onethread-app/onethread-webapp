import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { setRightSidebar } from 'stores/layout/Actions';
import { createPortal } from 'react-dom';

interface RightSidebarProps {
  children: JSX.Element;
  onClose: () => void;
}
interface RightSidebarInternalProps extends RightSidebarProps, RouteComponentProps {
  setRightSidebar: (data: boolean) => void;
  rightSidebarOpen: boolean;
}

const RightSidebarComponent = (props: RightSidebarInternalProps) => {

  const [target, setTarget] = useState<HTMLElement | null>(null);

  const createInnerElement: any = (idName: string, className: string = '') => {
    const innerContainer = document.createElement('div');
    innerContainer.setAttribute('id', idName);
    innerContainer.setAttribute('class', className);
    return innerContainer;
  };

  const clearInnerElement = () => {
    const innerRightSidebar: HTMLElement | null = document.getElementById('inner--right-sidebar');
    if (innerRightSidebar) {
      innerRightSidebar.remove();
    }
  };

  const checkClickOutside = (e: any) => {
    const mainLayout: HTMLElement | null = document.getElementById('main-layout');

    if (mainLayout && e.target === mainLayout) {
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

  useEffect(() => {
    props.setRightSidebar(true);
    const rightSidebar: HTMLElement | null = document.getElementById('rightSidebar');
    setTarget(rightSidebar);

    return () => {
      clearInnerElement();
      props.setRightSidebar(false);
    };
  }, []);

  return target !== null && props.rightSidebarOpen ?
    createPortal(props.children,
      target.appendChild(createInnerElement('inner--right-sidebar', 'h-100 overflow-y-auto'))) : null;
};

const mapStateToProps = (state: any) => {
  return {
    rightSidebarOpen: state.layoutReducer.rightSidebar.open
  };
};

export const RightSidebar = connect(mapStateToProps, {
  setRightSidebar
})(withRouter(RightSidebarComponent));