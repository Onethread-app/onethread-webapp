import { User } from 'stores/user/Reducer';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Card, Dialog } from '@blueprintjs/core';
import addIcon from '../../resources/images/addIcon.png';
import { AnnouncementEditor } from './announcementEditor';
import { tigrowApi } from 'config';
import { ICompany } from 'stores/company/Reducer';
import { tokenConfig } from 'stores/UtilsActions';
import { Loading } from 'components/Loading';

interface DashBoardViewProps {
  user: User;
  company: ICompany;
}

const DashboardViewComponent = (props: DashBoardViewProps) => {

  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState(Object);
  const [companyAnnouncement, setCompanyAnnouncement] = useState([]);

  useEffect(() => {

    async function getAPI() {
      const headers = tokenConfig();
      const response = await tigrowApi.get(
        `company/${props.company!._id}/dashboard`,
        headers);
      const res = await tigrowApi.get(
        `company/${props.company!._id}/announcements`,
        headers);
      await setDashboard(response.data.data);
      await setCompanyAnnouncement(res.data.company[0].announcement);
      await setLoading(false);
    }
    getAPI();

  }, []);

  return (
    <>
      <h1 className="mh4">Dashboard</h1>
      {
        loading === false ?
          <>
            <div className="flex mh4">
              <Card className="w-25 ma2">
                <h1 className="f6 fw6">Total running project</h1>
                <h1 className="mv0">{dashboard.totalProject}</h1>
              </Card>
              {/* <Card className="w-25 ma2">
          <h1 className="f6 fw6">Completed project</h1>
          <h1 className="mv0">10</h1>
        </Card> */}
              <Card className="w-25 ma2">
                <h1 className="f6 fw6">Total Employee</h1>
                <h1 className="mv0">{dashboard.totalEmployee}</h1>
              </Card>
              <Card className="w-25 ma2">
                <h1 className="f6 fw6">Total Associates</h1>
                <h1 className="mv0">{dashboard.totalAssociates}</h1>
              </Card>
            </div>
            <Card className="w-40 ma2"
              style={{ margin: '10px 40px' }}
            >
              <h1 className="f5">Company Announcement</h1>
              {companyAnnouncement.length > 0 ?
                companyAnnouncement.map((announcement) => (

                  <div className="flex items-center">
                    <div className="w2 h2 bg-red br2"></div>
                    <h1 className="f5 fw4 mh3">{announcement}</h1>
                  </div>

                )) : <p>No Announcements</p>
              }
            </Card>
            <div>
              <img
                onClick={() => setShowAnnouncementDialog(!showAnnouncementDialog)}
                src={addIcon}
                className={`fixed pointer`}
                style={{
                  bottom: '5rem',
                  right: '7rem',
                  width: '5rem',
                  boxShadow: '0px 6px 6px #00000029',
                  borderRadius: '50%'
                }}
              />
            </div>
          </> : <Loading />

      }
      {showAnnouncementDialog && (
        <Dialog
          onClose={() => setShowAnnouncementDialog(!showAnnouncementDialog)}
          isOpen={showAnnouncementDialog}
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <div>
            <AnnouncementEditor
              companyAnnouncement={companyAnnouncement}
              setcompanyAnnouncement={setCompanyAnnouncement}
              setShowDialog={setShowAnnouncementDialog} />
          </div>
        </Dialog>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
    company: state.companyReducer.currentCompany
  };
};

export const DashboardView = connect(mapStateToProps)(DashboardViewComponent);