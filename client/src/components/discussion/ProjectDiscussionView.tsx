import {
  ChangeEvent,
  Suspense,
  useMemo,
  useState,
  lazy,
} from 'react';
import { Dialog, Popover } from '@blueprintjs/core';

import { IRoomReducer } from 'stores/room/Reducer';
import useQuery from 'helpers/hooks/useQuery';

import { DiscussionViewContainer } from './ProjectDiscussion.styles';
import SuspenseLoader from 'components/loader/SuspenseLoader';
import {
  DiscussionTabs,
  DiscussionTab,
  TabPanel,
} from './DiscussionTabs';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { connect } from 'react-redux';
import { archiveRoom, getRoomMembers } from 'stores/room/Actions';
import { projectPermit } from 'stores/UtilsActions';
import { projectRules } from 'layouts/company/project/settings/projectrules';
import { AddMemberForm } from 'layouts/company/room/chatLayout/members/AddMemberForm';
import addMemberIcon from 'resources/images/addMemberIcon.png';

const DiscussionThread = lazy(() => import('./DiscussionThread'));
const DiscussionHighlights = lazy(
  () => import('./DiscussionHighlights'),
);
const DiscussionFiles = lazy(() => import('./DiscussionFiles'));

interface Props {
  getRoomMembers: (roomId: string) => void;
  archiveRoom: (data: { archive: boolean }, roomId: string) => void;
  currentRoom: IRoomReducer['currentRoom'];
  activeRoom: any;
  companyRole: string;
  users: IRoomReducer['users'];
  projectRole?: string;
  optionalRole?: string;
}

const allTabs = [
  { label: 'Thread', component: <DiscussionThread /> },
  { label: 'Highlighted', component: <DiscussionHighlights /> },
  { label: 'Files', component: <DiscussionFiles /> },
];

const ProjectDiscussionView = (props: Props) => {
  const query = useQuery();
  const tabValue = useMemo(() => {
    return query.get('thread') || '0';
  }, [query]);
  const [value, setValue] = useState<number>(parseInt(tabValue));
  const [showMemberDialog, setShowMemberDialog] =
    useState<boolean>(false);

  const handleChange = (event: ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const permissions = projectRules(
    props.projectRole,
    props.optionalRole,
  );

  return (
    <DiscussionViewContainer>
      <div className="flex justify-between items-center pl3 pr2">
        <span className="flex items-center">
          {props.currentRoom.name}{' '}
          {projectPermit(props.companyRole) ||
          (props.projectRole &&
            props.optionalRole &&
            props.currentRoom.archive === false) ? (
            <div
              className="pointer ml3-ns ml1"
              onClick={() => setShowMemberDialog(true)}
            >
              <img
                className="grow"
                src={addMemberIcon}
                width="30px"
                height="30px"
                alt=""
              />
            </div>
          ) : null}
        </span>
        <div className="flex items-center">
          <DiscussionTabs
            value={value}
            onChange={handleChange}
            aria-label="company tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            {allTabs.map((tab, i) => (
              <DiscussionTab label={tab.label} key={i} tab={value} />
            ))}
          </DiscussionTabs>
          <Popover
            minimal={true}
            popoverClassName="bg-white pa3"
            content={
              <div>
                {props.currentRoom?.archive ? (
                  <>
                    {projectPermit(props.companyRole) ? (
                      <h5
                        className="ma0 pointer bp3-popover-dismiss"
                        onClick={async () => {
                          props.archiveRoom(
                            {
                              archive: false,
                            },
                            props.currentRoom._id,
                          );
                        }}
                      >
                        Activate Room
                      </h5>
                    ) : (
                      <h5 className="ma0 pointer bp3-popover-dismiss gray">
                        No settings
                      </h5>
                    )}
                  </>
                ) : (
                  <>
                    {projectPermit(props.companyRole) ||
                    (props.projectRole &&
                      props.optionalRole &&
                      (permissions.grantAll ||
                        permissions.projectModerator.includes(
                          'archiveRoom',
                        ))) ? (
                      <h5
                        className="red ma0 pointer bp3-popover-dismiss"
                        onClick={async () => {
                          props.archiveRoom(
                            {
                              archive: true,
                            },
                            props.currentRoom._id,
                          );
                        }}
                      >
                        Archive Room
                      </h5>
                    ) : (
                      <h5 className="ma0 bp3-popover-dismiss gray">
                        No settings
                      </h5>
                    )}
                  </>
                )}
              </div>
            }
            target={<MoreVertIcon className="pointer" />}
          />
        </div>
      </div>
      <hr className="divider" />
      {allTabs.map((tab, i) => (
        <TabPanel value={value} index={i} key={i}>
          <Suspense fallback={<SuspenseLoader insideComponent />}>
            {tab.component}
          </Suspense>
        </TabPanel>
      ))}
      {showMemberDialog ? (
        <Dialog
          onClose={() => setShowMemberDialog(false)}
          isOpen={showMemberDialog}
          className="pb0 h-auto w-auto"
          canEscapeKeyClose={true}
          canOutsideClickClose={true}
        >
          <AddMemberForm
            showDialog={showMemberDialog}
            setShowDialog={setShowMemberDialog}
            room={props.currentRoom}
          />
        </Dialog>
      ) : null}
    </DiscussionViewContainer>
  );
};

const mapStateToProps = (state: any) => ({
  currentRoom: state.roomReducer.currentRoom,
  activeRoom: state.roomReducer.activeRoom,
  users: state.roomReducer.users,
  companyRole: state.companyReducer.currentCompany.role,
  projectRole:
    state.projectReducer.projectRole &&
    state.projectReducer.projectRole.projects &&
    state.projectReducer.projectRole.projects.role,
  optionalRole:
    state.projectReducer.projectRole &&
    state.projectReducer.projectRole.projects &&
    state.projectReducer.projectRole.projects.project &&
    state.projectReducer.projectRole.projects.project.optionalRole,
});

export default connect(mapStateToProps, {
  getRoomMembers,
  archiveRoom,
})(ProjectDiscussionView);
