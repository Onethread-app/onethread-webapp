import React, { useEffect } from 'react';
import { BasicInfoDetailsView } from 'layouts/company/profile/BasicInformationView';
import { useDispatch, connect } from 'react-redux';
import { UPDATE_ROOM, GET_COMPANY_ROOMS } from 'stores/room/Types';

// tslint:disable-next-line: no-var-requires
const { withChatkit } = require('@pusher/chatkit-client-react');

interface CompanyProfilePageProps {
  chatkit?: any;
  companyId: string;
}

export const CompanyProfilePageComponent = withChatkit((props: CompanyProfilePageProps) => {

  const dispatch = useDispatch();

  const connectChatManager = () => {
    if (!props.chatkit.isLoading) {
      props.chatkit.chatManager
        .connect({
          onRoomUpdated: (room: any) => {
            dispatch({ type: UPDATE_ROOM, payload: room });
          }
        })
        .then((currentUser: any) => {
          // console.log('Successful connection', currentUser)
        })
        .catch((err: any) => {
          connectChatManager();
        });
    }
  };

  useEffect(() => {
    if (!props.chatkit.isLoading && props.companyId) {
      connectChatManager();

      const companyRooms = props.chatkit.currentUser.rooms
        .filter((room: any) => room.customData.company === props.companyId)
        .map((room: any) => {
          return {
            _id: room.id,
            name: room.name,
            company: room.customData.company,
            project: room.customData.project,
            unreadCount: room.unreadCount,
          };
        });

      dispatch({ type: GET_COMPANY_ROOMS, payload: companyRooms });
    }
  }, [props.chatkit]);

  return (
    <div className="w-100">
      <h1 className="f4 tigrow-lightGray-1 ml4 mb0 mt5">Company Profile</h1>
      <BasicInfoDetailsView />
    </div>
  );
});

const mapStateToProps = (state: any) => {
  return {
    companyId: state.companyReducer.currentCompany._id,
  };
};

export const CompanyProfilePage = connect(mapStateToProps, null)(CompanyProfilePageComponent);
