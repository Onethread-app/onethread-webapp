import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { orderBy } from 'lodash';

import moment from 'moment';
import Typography from '@material-ui/core/Typography/Typography';
import { Dialog } from '@blueprintjs/core/lib/esm/components/dialog/dialog';

import { companyPermit } from 'stores/UtilsActions';

import { AnnouncementEditor } from '../../../layouts/dashBoard/announcementEditor';
import CompanyAnnouncementItem from '../company-announcements-new/CompanyAnnouncementItem';

const CompanyAnnouncementsList = (props: any) => {
  const { t } = useTranslation();
  const [showAnnouncementDialog, setShowAnnouncementDialog] =
    useState(false);

  const [currentAnnouncementPage, setCurrentAnnouncementPage] =
    useState(1);

  const [announcementItemsPerPage] = useState(3);

  const indexOfLastAnnouncement =
    currentAnnouncementPage * announcementItemsPerPage;
  const indexOfFirstAnnouncement =
    indexOfLastAnnouncement - announcementItemsPerPage;

  let currentAnnouncements: any;

  if (props.company.announce) {
    const allAnnouncements = orderBy(
      props.company.announce,
      ['createdAt'],
      ['desc'],
    );
    currentAnnouncements = allAnnouncements.slice(
      indexOfFirstAnnouncement,
      indexOfLastAnnouncement,
    );
  }

  const nextAnnouncementPage = (e) => {
    e.preventDefault();
    setCurrentAnnouncementPage(currentAnnouncementPage + 1);
  };

  const prevAnnouncementPage = (e) => {
    e.preventDefault();
    setCurrentAnnouncementPage(currentAnnouncementPage - 1);
  };

  const designationMap = {
    director: 'Director',
    cxo: 'CXO',
    seniorManager: 'Senior Manager',
    middleManager: 'Middle Manager',
    operationalEmployee: 'Operational Employee',
  };

  return (
    <>
      <div className="w-50-ns w-100">
        <div className="flex justify-between items-center">
          <h3
            style={{ color: '#34b3e9' }}
            className="justify-center f3-ns f5"
          >
            {t('app.company.Dashboard.Announce')}
          </h3>

          {companyPermit(props.company.role) && (
            <button
              onClick={() =>
                setShowAnnouncementDialog(!showAnnouncementDialog)
              }
              className="bp3-button w5 h2 pointer fr"
              style={{
                background: '#34b3e9',
                outline: 'none',
                color: '#fff',
              }}
            >
              <span>
                <img
                  src="https://tigrowresources.s3-ap-southeast-1.amazonaws.com/mic.svg"
                  alt="announcement"
                />
              </span>
              <span className="ml2-ns">
                {t('app.company.Dashboard.Create-Announcement')}
              </span>
            </button>
          )}
        </div>
        {props.company.announce && (
          <div className="w-100-l w-100 pa3 shadow-1 br2">
            {props.company.announce.length > 0 ? (
              currentAnnouncements.map((announcement: any) => (
                <CompanyAnnouncementItem
                  date={moment(announcement.createdAt).calendar()}
                  content={announcement.text}
                  key={announcement._id}
                  divison={
                    announcement.memberId &&
                    announcement.memberId.designations.length > 0
                      ? designationMap[
                          announcement.memberId.designations[0]
                            .division
                        ]
                      : announcement.memberId.role
                  }
                  firstName={
                    announcement.memberId.account
                      ? announcement.memberId.account.firstName
                      : null
                  }
                  lastName={
                    announcement.memberId.account
                      ? announcement.memberId.account.lastName
                      : null
                  }
                  position={
                    announcement.memberId &&
                    announcement.memberId.designations.length > 0
                      ? announcement.memberId.designations[0].position
                      : announcement.memberId.role
                  }
                />
              ))
            ) : (
              <Typography>
                {t('app.company.Dashboard.No-Announcement')}
              </Typography>
            )}
            {props.company.announce.length > 5 && (
              <div className="flex flex-row items-end w-100 justify-end">
                <div
                  className="f6 fw5 flex flex-row items-center"
                  style={{ color: '#BBBBBB' }}
                >
                  {currentAnnouncementPage > 1 && (
                    <span
                      className="mr2 pointer f4"
                      style={{ color: '#656565' }}
                      onClick={prevAnnouncementPage}
                    >
                      &lt;
                    </span>
                  )}
                  {currentAnnouncementPage} of{' '}
                  {Math.ceil(
                    props.company.announce.length /
                      announcementItemsPerPage,
                  )}
                  {currentAnnouncementPage <
                    Math.ceil(
                      props.company.announce.length /
                        announcementItemsPerPage,
                    ) && (
                    <span
                      className="ml2 pointer f4"
                      style={{ color: '#656565' }}
                      onClick={nextAnnouncementPage}
                    >
                      &#707;
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
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
              companyId={props.company._id}
            />
          </div>
        </Dialog>
      )}
    </>
  );
};

export default CompanyAnnouncementsList;
