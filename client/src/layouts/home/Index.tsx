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
interface HomePageComponentProps {
  currentCompany: ICompany;
  getAllCompaniesByUserId: (userId: string) => void;
  getProjectsIndividual: () => void;
  user: User;
  project: IMember[];
}

export const HomePageComponent = (
  props: HomePageComponentProps & RouteComponentProps,
) => {
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    await props.getAllCompaniesByUserId(props.user._id);
    // await props.getProjectsIndividual();
    setLoading(false);
  };

  useEffect(() => {
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
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.userReducer.user,
    project: state.projectReducer.projectList,
    currentCompany: state.companyReducer.currentCompany,
  };
};

export const HomePageNew = connect(mapStateToProps, {
  getAllCompaniesByUserId,
  getProjectsIndividual,
})(withRouter(HomePageComponent));
