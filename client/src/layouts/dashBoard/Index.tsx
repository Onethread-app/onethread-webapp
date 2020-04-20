import { User } from 'stores/user/Reducer';
import React, { useState, useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Card, Dialog } from '@blueprintjs/core';
import addIcon from '../../resources/images/addIcon.png';
import { AnnouncementEditor } from './announcementEditor';
import { tigrowApi } from 'config';
import { ICompany } from 'stores/company/Reducer';
import { tokenConfig } from 'stores/UtilsActions';
import { Loading } from 'components/Loading';
import { getCompanyAnnouncement } from 'stores/company/Actions';
// import { Text } from '@blueprintjs/core';
import {
  ADD_TOTAL_ASSOCIATE,
  ADD_TOTAL_MEMBER,
} from 'stores/company/Types';

interface DashBoardViewProps {
  user: User;
  company: ICompany;
  getCompanyAnnouncement: () => void;
}

const DashboardViewComponent = (props: DashBoardViewProps) => {
  const [
    showAnnouncementDialog,
    setShowAnnouncementDialog,
  ] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(Object);
  const dispatch = useDispatch();
  useEffect(() => {
    async function getAPI() {
      const headers = tokenConfig();
      try {
        const response = await tigrowApi.get(
          `company/${props.company!._id}/dashboard`,
          headers,
        );
        dispatch({
          type: ADD_TOTAL_ASSOCIATE,
          payload: response.data.data.totalAssociates,
        });
        dispatch({
          type: ADD_TOTAL_MEMBER,
          payload: response.data.data.totalEmployee,
        });
        await setDashboard(response.data.data);
        await props.getCompanyAnnouncement();
        await setLoading(false);
      } catch (error) {
        await setLoading(false);
      }
    }
    getAPI();
  }, [props.company._id]);

  return (
    <>
      {loading === false ? (
        <>
          <div className="mh4">
            <div className="flex justify-between">
              <Card className="w-25 ma2">
                <h1 className="f6 fw6">Total running project</h1>
                <h1 className="mv0">{dashboard.totalProject}</h1>
              </Card>
              <Card className="w-25 ma2">
                <h1 className="f6 fw6">Completed project</h1>
                <h1 className="mv0">0</h1>
              </Card>
              <Card className="w-25 ma2">
                <h1 className="f6 fw6">Total Employee</h1>
                <h1 className="mv0">{dashboard.totalEmployee}</h1>
              </Card>
              <Card className="w-25 ma2">
                <h1 className="f6 fw6">Total Associates</h1>
                <h1 className="mv0">{dashboard.totalAssociates}</h1>
              </Card>
            </div>
            <div>
              <Card className="w-50 ma2">
                <h1 className="f5">Company Announcement</h1>
                {props.company.announce &&
                props.company.announce.length > 0 ? (
                  props.company.announce.map((announcement: any) => (
                    <div className="flex items-center">
                      <div
                        className="w2 h2 bg-red br2 mv1"
                        style={{ width: '35px', height: '35px' }}
                      ></div>
                      {/* <Text ellipsize={true} className="f5 fw4 mh3 ws-normal"> */}
                      <h1
                        className="w-90 f5 fw4 mh3 tj break-word"
                        style={{ lineHeight: '25px' }}
                      >
                        {announcement.text}
                      </h1>
                      {/* </Text> */}
                    </div>
                  ))
                ) : (
                  <small>No announcements.</small>
                )}
              </Card>
            </div>
          </div>
          <div>
            <img
              onClick={() =>
                setShowAnnouncementDialog(!showAnnouncementDialog)
              }
              src={addIcon}
              className={`fixed pointer`}
              style={{
                bottom: '5rem',
                right: '7rem',
                width: '5rem',
                boxShadow: '0px 6px 6px #00000029',
                borderRadius: '50%',
              }}
            />
          </div>
        </>
      ) : (
        <Loading />
      )}
      {showAnnouncementDialog && (
        <Dialog
          onClose={() =>
            setShowAnnouncementDialog(!showAnnouncementDialog)
          }
          isOpen={showAnnouncementDialog}
          style={{ background: '#fff' }}
          canOutsideClickClose={true}
        >
          <div>
            <AnnouncementEditor
              setShowDialog={setShowAnnouncementDialog}
            />
          </div>
        </Dialog>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
    company: state.companyReducer.currentCompany,
  };
};

export const DashboardView = connect(mapStateToProps, {
  getCompanyAnnouncement,
})(DashboardViewComponent);
