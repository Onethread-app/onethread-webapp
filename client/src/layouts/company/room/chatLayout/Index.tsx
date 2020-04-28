import React, { useState } from 'react';
import { SendMessageForm } from './messages/SendMessageForm';
import { MessageList } from './messages/MessageList';
import { connect } from 'react-redux';
import { Dialog, Position, Popover } from '@blueprintjs/core';
import { AddMemberForm } from './members/AddMemberForm';
import { getRoomMembers, archiveRoom } from 'stores/room/Actions';
import { isEmpty } from 'lodash';
import { projectPermit } from 'stores/UtilsActions';
import { MembersList } from './members/MembersList';
import { IRoomReducer } from 'stores/room/Reducer';
import memberListIcon from './../../../../resources/images/member-list.svg';
import addMemberIcon from './../../../../resources/images/addMemberIcon.png';
import settingsIcon from './../../../../resources/images/settings.svg';
import videoCallIcon from './../../../../resources/images/video-call.png';
import { VideoCallRequest } from './VideoCallRequest';
<<<<<<< HEAD
=======
import { Link } from 'react-router-dom';
>>>>>>> fb598f958b17443243c8fd5181fd5915ed577e06

interface ChatLayoutComponentProps {
  getRoomMembers: (roomId: string) => void;
  archiveRoom: (data: { archive: boolean }, roomId: string) => void;
  currentRoom: IRoomReducer['currentRoom'];
  activeRoom: any;
  companyRole: string;
  users: IRoomReducer['users'];
}

export const ChatLayoutComponent = (
  props: ChatLayoutComponentProps,
) => {
  const [showMemberFormDialog, setShowMemberFormDialog] = useState(
    false,
  );
  const [showMemberListDialog, setShowMemberListDialog] = useState(
    false,
  );
  const [showVideoCallDialog, setShowVideoCallDialog] = useState(
    false,
  );

  return (
    <>
      {isEmpty(props.currentRoom.name) === false &&
      isEmpty(props.currentRoom._id) === false ? (
        <div className="flex flex-column h-100 w-100">
          {/* chat heading starts */}
          <div className="flex justify-between items-center ph4 pv2 bb b--tigrowLightGray-1">
            <div>
              <p className="f4 fw7 mv2">{props.currentRoom.name}</p>
              <div
                onClick={() =>
                  setShowMemberListDialog(!showMemberListDialog)
                }
                className="ma0 pointer dim flex items-center"
              >
                <img
                  className=""
                  src={memberListIcon}
                  width="20px"
                  height="20px"
                  style={{}}
                  color="#0FA3A3"
                />
                <span className="f5 ml2 fw7">
                  {props.users.length}
                </span>
              </div>
            </div>
            <div className="flex">
              <div className="pointer">
                <Popover
                  minimal={true}
                  // isOpen={true}
                  position={Position.BOTTOM}
                  popoverClassName="bg-white pa3"
                  content={
                    <div>
                      {props.currentRoom.archive ? (
                        <>
                          {projectPermit(props.companyRole) ? (
                            <h5
                              className="ma0 pointer bp3-popover-dismiss"
                              onClick={async () => {
                                await props.archiveRoom(
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
                          <h5 className="gray ma0 mb2 pointer bp3-popover-dismiss">
                            Mute Conversation
                          </h5>
                          {projectPermit(props.companyRole) && (
                            <h5
                              className="red ma0 pointer bp3-popover-dismiss"
                              onClick={async () => {
                                await props.archiveRoom(
                                  {
                                    archive: true,
                                  },
                                  props.currentRoom._id,
                                );
                              }}
                            >
                              Archive Room
                            </h5>
                          )}
                        </>
                      )}
                    </div>
                  }
                  target={
                    <div>
                      <img
                        className="grow"
                        src={settingsIcon}
                        width="30px"
                        height="30px"
                      />
                    </div>
                  }
                />
              </div>
              {projectPermit(props.companyRole) &&
              props.currentRoom.archive === false ? (
                <div
                  className="pointer ml3"
                  onClick={() =>
                    setShowMemberFormDialog(!showMemberFormDialog)
                  }
                >
                  <img
                    className="grow"
                    src={addMemberIcon}
                    width="30px"
                    height="30px"
                  />
                </div>
              ) : null}
              {props.currentRoom.archive === false && (
                <div className="pointer ml3">
                  <Popover
                    minimal={true}
                    position={Position.BOTTOM}
                    popoverClassName="bg-white pa3"
                    content={
                      <div>
<<<<<<< HEAD
                          <div
                            className="br3 ba b--gray gray pointer bp3-popover-dismiss pa2 tc"
                            onClick={() => {
                              window.open('https://8x8.vc', '_blank');
=======
                        <Link to="https://8x8.vc">
                          <div
                            className="br3 ba b--gray gray pointer bp3-popover-dismiss pa2 tc"
                            onClick={() => {
                              window.location.assign(
                                'https://8x8.vc',
                              );
>>>>>>> fb598f958b17443243c8fd5181fd5915ed577e06
                            }}
                          >
                            <h4 className="mv0">Basic</h4>
                            <h5 className="mv0">
                              with our partner 8x8
                            </h5>
                          </div>
<<<<<<< HEAD
=======
                        </Link>
>>>>>>> fb598f958b17443243c8fd5181fd5915ed577e06
                        <div
                          className="br3 ba b--gray gray pointer bp3-popover-dismiss mt2 pa2 tc"
                          onClick={() =>
                            setShowVideoCallDialog(
                              !showVideoCallDialog,
                            )
                          }
                        >
                          <h4 className="mv0 c-tigrowViolet">
                            Enterprise
                          </h4>
                        </div>
                      </div>
                    }
                    target={
                      <div>
                        <img
                          className="grow"
                          src={videoCallIcon}
                          width="30px"
                          height="30px"
                        />
                      </div>
                    }
                  />
                </div>
              )}
            </div>
          </div>
          {/* chat heading ends */}
          <MessageList />
          {props.currentRoom.archive === false ? (
            <SendMessageForm />
          ) : (
            <div className="flex justify-center items-center h4">
              <h3 className="fw5 f3">The Room is archived</h3>
            </div>
          )}
        </div>
      ) : (
        <h2>Please, select a room !!</h2>
      )}

      {showVideoCallDialog && (
        <Dialog
          onClose={() => setShowVideoCallDialog(!showVideoCallDialog)}
          isOpen={showVideoCallDialog}
          canOutsideClickClose={false}
          style={{ background: '#fff' }}
        >
          <VideoCallRequest
            setShowVideoCallDialog={setShowVideoCallDialog}
          />
        </Dialog>
      )}

      {showMemberListDialog && (
        <Dialog
          onClose={() =>
            setShowMemberListDialog(!showMemberListDialog)
          }
          isOpen={showMemberListDialog}
          style={{ background: '#fff' }}
        >
          <MembersList users={props.users} />
        </Dialog>
      )}

      {showMemberFormDialog && (
        <Dialog
          onClose={() =>
            setShowMemberFormDialog(!showMemberFormDialog)
          }
          isOpen={showMemberFormDialog}
          style={{ background: '#fff' }}
        >
          <AddMemberForm
            showDialog={showMemberFormDialog}
            setShowDialog={() =>
              setShowMemberFormDialog(!showMemberFormDialog)
            }
          />
        </Dialog>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    currentRoom: state.roomReducer.currentRoom,
    activeRoom: state.roomReducer.activeRoom,
    users: state.roomReducer.users,
    companyRole: state.companyReducer.currentCompany.role,
  };
};

export const ChatLayout = connect(mapStateToProps, {
  getRoomMembers,
  archiveRoom,
})(ChatLayoutComponent);
