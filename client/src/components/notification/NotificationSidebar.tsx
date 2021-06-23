import React from 'react';

interface INotificationSidebar {
  activeTab: number;
  setActiveTab: React.Dispatch<React.SetStateAction<number>>;
}

const NotificationSidebar = (props: INotificationSidebar) => {
  return (
    <div className="notification-sidebar flex flex-column items-center  h-100">
      <div
        className={props.activeTab === 0 ? 'active' : ''}
        onClick={() => props.setActiveTab(0)}
      >
        Today
      </div>
      <div
        className={props.activeTab === 1 ? 'active' : ''}
        onClick={() => props.setActiveTab(1)}
      >
        Past Week
      </div>
      <div
        className={props.activeTab === 2 ? 'active' : ''}
        onClick={() => props.setActiveTab(2)}
      >
        Past Month
      </div>
      <div
        className={props.activeTab === 3 ? 'active' : ''}
        onClick={() => props.setActiveTab(3)}
      >
        All
      </div>
    </div>
  );
};

export default NotificationSidebar;
