import { connect } from 'react-redux';

import { Discussion } from './discussion/Index';
import { SharedFile } from './sharedFiles/Index';

interface RoomRightSidebarComponentProps {
  isOpen: boolean;
}

const RoomRightSidebarComponent = (
  props: RoomRightSidebarComponentProps,
) => (
  <div className='pl3 h-100'>
    <Discussion />
    <SharedFile />
  </div>
);

const mapStateToProps = (state: any) => ({});

export const RoomRightSidebar = connect(
  mapStateToProps,
  null,
)(RoomRightSidebarComponent);
