import { useEffect, useState } from 'react';
import { isMobileOnly } from 'react-device-detect';
import { withRouter } from 'react-router';
import { History } from 'history';
import { connect } from 'react-redux';
import { Badge } from '@material-ui/core';
import { RouteComponentProps } from 'react-router-dom';
import { upperFirst } from 'lodash';

import chatIcon from '../../resources/images/chatIcon.svg';
// import AddIcon from '@material-ui/icons/Add';
import notificationIcon from '../../resources/images/notification.svg';
import NotificationPopover from 'components/notification/NotificationPopover';
import { Avatar, Container } from './Navbar.styles';
import {
  Button,
  ButtonGroup,
  Dialog,
  Popover,
  Position,
} from '@blueprintjs/core';
import { logoutAction } from 'stores/auth/Actions';
import { companySubscriber } from 'helpers/notification/subscribers';
import {
  clearSeen,
  getNotifications,
  seenNotification,
} from 'stores/notifications/Action';
import { fetchChats, fetchRooms } from 'stores/room/Actions';
import { User } from 'stores/user/Reducer';
import { IChat, IRoom } from 'stores/room/Reducer';
import ChatListItem from 'components/chat/ChatListItem';
import { useTranslation } from 'react-i18next';
import ReportForm from 'components/ReportForm';
import CreateOptionList from './CreateOptionList';
import ProjectDialog from 'components/home/project-section/ProjectDialog';
import { CompanySignupForm } from 'components/home/company-section/CompanyDialog';
import TaskDialog from 'components/home/task-section/TaskDialog';
import AnnouncementDialog from 'components/announcement/AnnouncementDialog';
interface Props extends RouteComponentProps {
  user: User;
  userCompanyLoading: boolean;
  uniqueCompanyName: string;
  companyId: string;
  read: number;
  seen: number;
  chats: [IChat];
  totalRoomUnread: number;
  currentRoom: IRoom;
  getNotifications: () => void;
  seenNotification: () => void;
  fetchRooms: () => void;
  fetchChats: () => void;
  logoutAction: (history: History) => void;
  scrollTop: number;
}

export const compareChats = (a: any, b: any) => {
  if (a.message.createdAt < b.message.createdAt) return 1;
  else if (a.message.createdAt > b.message.createdAt) return -1;
  else return 0;
};

const UpdatedNavbar = (props: Props) => {
  const [openCompanyDialog, setOpenCompanyDialog] =
    useState<boolean>(false);
  const [showButtonReport, setShowButtonReport] = useState(false);
  const [openProjectDialog, setOpenProjectDialog] =
    useState<boolean>(false);
  const [openTaskDialog, setOpenTaskDialog] =
    useState<boolean>(false);
  const [openAnnouncementDialog, setOpenAnnouncementDialog] =
    useState<boolean>(false);
  const { t } = useTranslation();

  const handleSearch = (e: { preventDefault: () => void }) => {
    e.preventDefault();
  };
  const handleSeenNotifications = async () => {
    props.seen !== 0 && props.seenNotification();
    // props.getNotifications();
  };

  const createOptionsListProps = () => {
    return {
      setOpenCompanyDialog,
      setOpenProjectDialog,
      setOpenTaskDialog,
      setOpenAnnouncementDialog,
    };
  };

  useEffect(() => {
    props.getNotifications();
    companySubscriber(props.companyId);
    props.fetchRooms();
    props.fetchChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <form onSubmit={handleSearch}>
        {/* <input
          type="text"
          name="search"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search projects, colleages, tasks"
        /> */}
      </form>
      <div className="nav-buttons-container">
        {props.userCompanyLoading === false ? (
          <Popover
            popoverClassName="bg-white popover"
            position={Position.BOTTOM_LEFT}
            content={
              <CreateOptionList listProps={createOptionsListProps} />
            }
            target={
              <div className="mr2 pointer">
                <Button className="create-button">Create +</Button>
              </div>
            }
          />
        ) : null}
        <Popover
          popoverClassName="bg-white"
          position={Position.BOTTOM}
          content={
            <div
              style={{
                maxHeight: '300px',
                width: isMobileOnly ? '320px' : '420px',
              }}
              className={`pt2 pb1 overflow-y-auto`}
            >
              {props.chats && props.chats.length ? (
                props.chats
                  .sort(compareChats)
                  .map((chat: IChat, index) => (
                    <ChatListItem chat={chat} key={index} />
                  ))
              ) : (
                <p className="ph2">No room To Show</p>
              )}
            </div>
          }
          target={
            <div className="mr3 pointer">
              <Badge
                badgeContent={props.totalRoomUnread}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                color="secondary"
              >
                <img src={chatIcon} alt="" />
              </Badge>
            </div>
          }
        />
        <Popover
          popoverClassName="bg-white"
          position={Position.BOTTOM}
          content={<NotificationPopover />}
          target={
            <div className="mr2 pointer">
              <Badge
                badgeContent={props.seen}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                color="secondary"
              >
                <img
                  src={notificationIcon}
                  alt=""
                  onClick={handleSeenNotifications}
                />
              </Badge>
            </div>
          }
        />
        <Popover
          popoverClassName="bp3-popover-content-sizing"
          position={Position.BOTTOM}
          content={
            <ButtonGroup
              minimal={true}
              className="bp3-vertical bp3-fill"
            >
              <Button
                className="bp3-minimal outline-0 bp3-popover-dismiss"
                onClick={() =>
                  props.history.push(`/${props.user.name}`)
                }
              >
                <div className="dtc w1 w2-ns">
                  <Avatar>
                    {props.user?.firstName?.substring(0, 2)}
                  </Avatar>
                </div>
                <div className="dtc v-mid pl3">
                  <h1 className="f7 f6-ns fw4 lh-title black mv0">
                    {`${upperFirst(
                      props.user.firstName,
                    )} ${upperFirst(props.user.lastName)}`}
                  </h1>
                </div>
              </Button>
              <Button
                className="bp3-minimal outline-0 bp3-popover-dismiss"
                icon="cog"
                alignText="left"
                onClick={() =>
                  props.history.push(`/${props.user.name}/settings`)
                }
              >
                {t('app.company.Settings.Settings')}
              </Button>
              <Button
                className="bp3-minimal outline-0 bp3-popover-dismiss"
                onClick={(e: any) => setShowButtonReport(true)}
                icon="issue"
                alignText="left"
              >
                {t('app.user.User-settings.Report-Issue')}
              </Button>
              <Button
                className="bp3-minimal outline-0 bp3-popover-dismiss"
                onClick={(e: any) =>
                  props.logoutAction(props.history)
                }
                icon="log-in"
                alignText="left"
              >
                {t('app.user.User-settings.Logout')}
              </Button>
            </ButtonGroup>
          }
          target={
            props.user.profileImage !== '' ? (
              <img
                src={props.user.profileImage}
                alt="profile"
                className="profile-pic"
              />
            ) : (
              <Avatar>
                {props.user?.firstName?.substring(0, 2)}
              </Avatar>
            )
          }
        />
      </div>
      {showButtonReport ? (
        <Dialog
          onClose={() => setShowButtonReport(!showButtonReport)}
          isOpen={showButtonReport}
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <div>
            <ReportForm setShowButtonReport={setShowButtonReport} />
          </div>
        </Dialog>
      ) : null}

      <Dialog
        canOutsideClickClose={true}
        canEscapeKeyClose={true}
        autoFocus
        style={{ borderRadius: '1rem' }}
        className="w-auto h-auto pb0"
        onClose={() => setOpenProjectDialog(false)}
        isOpen={openProjectDialog}
      >
        <ProjectDialog
          // setProjects={setProjects}
          setOpenProjectDialog={setOpenProjectDialog}
        />
      </Dialog>

      <Dialog
        isOpen={openCompanyDialog}
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        autoFocus
        style={{ borderRadius: '1rem' }}
        onClose={() => setOpenCompanyDialog(false)}
        className="w-auto h-auto pb0"
      >
        <CompanySignupForm setShowDialog={setOpenCompanyDialog} />
      </Dialog>

      <Dialog
        isOpen={openTaskDialog}
        canOutsideClickClose={true}
        canEscapeKeyClose={true}
        autoFocus
        style={{ borderRadius: '1rem' }}
        onClose={() => setOpenTaskDialog(false)}
        className="w-auto h-auto pb0"
      >
        <TaskDialog setShowDialog={setOpenTaskDialog} />
      </Dialog>

      <Dialog
        isOpen={openAnnouncementDialog}
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        autoFocus
        style={{ borderRadius: '1rem' }}
        onClose={() => setOpenAnnouncementDialog(false)}
        className="w-auto h-auto pb0"
      >
        <AnnouncementDialog
          setOpenAnnouncementDialog={setOpenAnnouncementDialog}
          setOpenCompanyDialog={setOpenCompanyDialog}
        />
      </Dialog>
    </Container>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
    userCompanyLoading: state.userReducer.userCompanyLoading,
    uniqueCompanyName: state.companyReducer.currentCompany.uniqueName,
    companyId: state.companyReducer.currentCompany._id,
    seen: state.notificationReducer.seen,
    read: state.notificationReducer.read,
    chats: state.roomReducer.chats,
    currentRoom: state.roomReducer.currentRoom,
    totalRoomUnread: state.roomReducer.totalUnread,
  };
};

export default connect(mapStateToProps, {
  logoutAction,
  companySubscriber,
  getNotifications,
  seenNotification,
  clearSeen,
  fetchRooms,
  fetchChats,
})(withRouter(UpdatedNavbar));
