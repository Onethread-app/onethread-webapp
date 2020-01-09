import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { setRightSidebar } from 'stores/layout/Actions';

interface RightSidebarProps {
  children: JSX.Element;
  open: boolean;
}
interface RightSidebarInternalProps extends RightSidebarProps, RouteComponentProps {
  setRightSidebar: (data: boolean) => void;
}

const RightSidebarComponent = (props: RightSidebarInternalProps) => {
  useEffect(() => {
    props.setRightSidebar(props.open);
  }, [props.open]);

  return (
    <div
      className="sidebar-right h-100 c-tigrowWhite"
      style={{
        display: props.open ? 'block' : 'none',
        background: 'rgb(6, 5, 23)'
      }}
    >
      {props.children}
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    rightSidebarOpen: state.layoutReducer.rightSidebar.open
  };
};

export const RightSidebar = connect(mapStateToProps, { setRightSidebar })(withRouter(RightSidebarComponent));