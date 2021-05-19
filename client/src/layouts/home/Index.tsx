import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getAllCompaniesByUserId } from 'stores/user/Actions';
import { getProjectsIndividual } from 'stores/project/Actions';
import { User } from 'stores/user/Reducer';
import { IMember } from 'stores/project/Reducer';
import { withRouter, RouteComponentProps } from 'react-router';
import { CompanyList } from './CompanyList';
import { ProjectList } from './ProjectList';
import { VideoConference } from './VideoList';
import { Loading } from 'components/Loading';
import { ICompany } from 'stores/company/Reducer';
import ErrorText from 'layouts/company/settings/ErrorText';
import Modal from 'react-modal';
import { setExpireMassage } from 'stores/subscriptionBilling/Actions';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

interface HomePageComponentProps {
  currentCompany: ICompany;
  getAllCompaniesByUserId: (userId: string, type: string) => void;
  getProjectsIndividual: () => void;
  user: User;
  project: IMember[];
  subscriptiontExpired: boolean;
  setExpireMassage: () => void;
  massageShown: boolean;
}

export const HomePageComponent = (
  props: HomePageComponentProps & RouteComponentProps,
) => {
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = React.useState(false);

  function closeModal() {
    setSuccess(false);
  }

  const load = async () => {
    setLoading(true);
    await props.getAllCompaniesByUserId(props.user._id, 'home');
    // await props.getProjectsIndividual();
    setLoading(false);
  };

  useEffect(() => {
    setSuccess(props.subscriptiontExpired);
    load();
  }, []);

  return (
    <>
      <div className="pt5 pt0-ns" style={{ background: '#0F0C4E' }}>
        {loading ? (
          <Loading />
        ) : (
          <>
            <CompanyList />
            <div
              className="pa4-ns pa2 br4"
              style={{ background: '#F6F7FB' }}
            >
              <ProjectList />
              <VideoConference />
            </div>
          </>
        )}
      </div>
      {success &&
        props.massageShown !== true &&
        props.currentCompany.role !== 'superAdmin' && (
          <Modal
            isOpen={success}
            // onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <ErrorText
              setExpireMassage={props.setExpireMassage}
              closeModal={closeModal}
              text="Your Subscription has expired, contact with Super Admin"
              subtext="To keep using Onethread without interruption you need to pay your
              dues."
            />
          </Modal>
        )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
    project: state.projectReducer.projectList,
    currentCompany: state.companyReducer.currentCompany,
    subscriptiontExpired:
      state.subscriptionReducer.subscriptionExpired,
    massageShown: state.subscriptionReducer.massageShown,
  };
};

export const HomePageNew = connect(mapStateToProps, {
  getAllCompaniesByUserId,
  getProjectsIndividual,
  setExpireMassage,
})(withRouter(HomePageComponent));
