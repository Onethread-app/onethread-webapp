import React from 'react';
import { connect } from 'react-redux';
import { Discussion } from './discussion/Index';
import { SharedFile } from './sharedFiles/Index';

interface RoomRightSidebarComponentProps {
  isOpen: boolean;
}

const RoomRightSidebarComponent = (
  props: RoomRightSidebarComponentProps,
) => {
  return (
    <div className="pl3 h-100">
      <Discussion />
      <SharedFile />
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {};
};

export const RoomRightSidebar = connect(
  mapStateToProps,
  null,
)(RoomRightSidebarComponent);
