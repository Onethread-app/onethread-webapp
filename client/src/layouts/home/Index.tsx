import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Card, HTMLTable, Icon, Dialog } from '@blueprintjs/core';
import { getAllCompaniesByUserId } from 'stores/user/Actions';
import { getProjectsIndividual } from 'stores/project/Actions';
import CompanyIcon from './../../resources/images/CompanyIcon.svg';
import { CompanySignupForm } from 'layouts/company/Form';
import { isMobileOnly } from 'react-device-detect';
import { User } from 'stores/user/Reducer';
import { IMember } from 'stores/project/Reducer';
import VideoConferences from 'layouts/videoConferences/pages/index/index';
import { getNotifications } from '../../stores/notifications/Action';
import { getCompanyDetails } from 'stores/company/Actions';
import { withRouter, RouteComponentProps } from 'react-router';
import { History } from 'history';
import { CLEAR_PROJECT_REDUCER_STATE } from 'stores/project/Types';
import { addSpace } from 'stores/UtilsActions';
import { ICompanyResponse } from 'stores/company/Reducer';
interface HomePageComponentProps {
  currentCompany: string;
  getAllCompaniesByUserId: (userId: string) => void;
  getProjectsIndividual: () => void;
  getNotifications: () => void;
  getCompanyDetails: (companyId: string, history: History) => void;
  user: User;
  project: IMember[];
}

export const HomePageComponent = (props: HomePageComponentProps & RouteComponentProps) => {

  const [showDialog, setShowDialog] = useState(false);
  const dispatch = useDispatch();

  const load = async () => {
    await props.getAllCompaniesByUserId(props.user._id);
    await props.getProjectsIndividual();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <div className="pa4-ns pa2 pt5 pt0-ns">
        <h1 className="f3-ns f5">Places You Work</h1>
        <div className="flex-ns items-center">
          <div className="overflow-x-auto w-90-ns w-100 pv1"
            style={{
              display: 'grid',
              gridAutoFlow: 'column'
            }}>
            {props.user.companies && props.user.companies.map((c) => (
              <Card
                className={`ma2 pointer ${
                  props.currentCompany === c.company._id
                    ? 'bg-black-10'
                    : ''
                  }`}
                style={{ width: '160px' }}
                onClick={async () => {
                  props.getNotifications();
                  const response = (await props.getCompanyDetails(
                    c.company.uniqueName,
                    props.history,
                  )) as any;
                  if (response.status === 200) {
                    dispatch({ type: CLEAR_PROJECT_REDUCER_STATE });
                    props.history.push(
                      `/company/${
                      (response as ICompanyResponse).data.company.uniqueName
                      }/dashboard`,
                    );
                  }
                }}
              >
                <div className="tc">
                  <img
                    src={
                      c.company.logo ? c.company.logo : CompanyIcon
                    }
                    alt="user"
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                    }}
                  />
                  <div>
                    <h1 className="f7 f5-ns lh-title black ws-break">
                      {c.company.name}{' '}
                    </h1>
                    <h2 className="f6 fw4 mt0 mb0 black-60 ws-break">{`Role: ${addSpace(c.role)}`}</h2>
                  </div>
                </div>
              </Card>
            ))
            }
          </div>
          <div className="pointer tc ma3-ns pl2-ns ma1 mt3 mt0-ns"
            onClick={() => setShowDialog(!showDialog)}
          >
            <Icon
              icon="insert"
              iconSize={isMobileOnly ? 30 : 60}
              color="silver"
            />
            <h1 className="f6 silver">Create a Company</h1>
          </div>
        </div>
        <h1 className="f3-ns f5">Projects</h1>
        <div className="overflow-y-auto h5">
          <HTMLTable className="w-100 mv3" striped={true}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Recent Activity</th>
                <th>Lead</th>
              </tr>
            </thead>
            <tbody>
              {props.project && props.project.length > 0 ? (
                props.project.map((p) => (
                  <tr >
                    <td style={{ width: '25%' }}>
                      {p.name}
                    </td>
                    <td style={{ width: '25%' }}>
                      {p.type}
                    </td>
                    <td style={{ width: '25%' }}>
                      dcsdlvk scknndovc
            </td>
                    <td style={{ width: '25%' }}>
                      {p.concernedAdmin.firstName}{p.concernedAdmin.lastName}
                    </td>
                  </tr>)))
                :
                (
                  <tr>
                    <td colSpan={4}>No Projects</td>
                  </tr>
                )}
            </tbody>
          </HTMLTable>
        </div>
        {/* <h1 className="f3-ns f5">Room For Communication</h1>
        <div className="overflow-y-auto h5">
          <HTMLTable className="w-100 mv3" striped={true}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Invitation Link</th>
              </tr>
            </thead>
            <tbody>
              <tr >
                <td style={{ width: '50%' }}>
                  sdcsf sdcndfc
            </td>
                <td style={{ width: '50%' }}>
                  dscsdnjdv  sdnclwedofc
            </td>
              </tr>
              <tr>
                <td colSpan={4}>No Projects</td>
              </tr>
            </tbody>
          </HTMLTable>
        </div> */}
        <h1 className="f3-ns f5">Video Conferences</h1>
        <VideoConferences />
        {/* <div className="overflow-y-auto h5">
          <HTMLTable className="w-100 mv3" striped={true}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Invitation Link</th>
                <th>Scheduled Time</th>
                <th>Meeting Minutes</th>
              </tr>
            </thead>
            <tbody>
              <tr >
                <td style={{ width: '25%' }}>
                  sdcsf sdcndfc
            </td>
                <td style={{ width: '25%' }}>
                  dscsdnjdv  sdnclwedofc
            </td>
                <td style={{ width: '25%' }}>
                  dcsdlvk scknndovc
            </td>
                <td style={{ width: '25%' }}>
                  sdcndijfc sdfcnoew
            </td>
              </tr>
              <tr>
                <td colSpan={4}>No Projects</td>
              </tr>
            </tbody>
          </HTMLTable>
        </div> */}
      </div>
      {showDialog && (
        <Dialog
          onClose={() => setShowDialog(!showDialog)}
          isOpen={showDialog}
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
        >
          <div>
            <CompanySignupForm setShowDialog={setShowDialog} />
          </div>
        </Dialog>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
    project: state.projectReducer.projectList,
    currentCompany: state.companyReducer.currentCompany._id
  };
};

export const HomePageNew = connect(
  mapStateToProps,
  {
    getAllCompaniesByUserId,
    getProjectsIndividual,
    getNotifications,
    getCompanyDetails,
  },
)(withRouter(HomePageComponent));
