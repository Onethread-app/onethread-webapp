import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button, Divider } from '@blueprintjs/core';
import { Loading } from 'components/Loading';
import {
  getAllPendingProjects,
  acceptPendingProject,
  rejectPendingProject,
} from 'stores/project/Actions';
import { IPendingProject } from 'stores/project/Reducer';
import { withRouter, RouteComponentProps } from 'react-router-dom';

interface IProjectRequestComponent {
  PendingProjects: IPendingProject[];
  getAllPendingProjects: () => void;
  acceptPendingProject: (project: IPendingProject) => void;
  rejectPendingProject: (projectId: string) => void;
  companyRole: string;
}

const ProjectRequestComponent = (
  props: IProjectRequestComponent & RouteComponentProps,
) => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // get all pending projects

    async function loadPendingProjects(
      getAllPendingProjects: () => void,
    ) {
      setLoading(true);
      if (props.companyRole !== 'employee') {
        getAllPendingProjects();
      }
      setLoading(false);
    }
    loadPendingProjects(props.getAllPendingProjects);
  }, []);

  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  return (
    <div>
      {loading === false ? (
        props.PendingProjects && props.PendingProjects.length > 0 ?
        props.PendingProjects.map((pending) => (
          <main className="">
            <article className="dt w-100 pv4 mt2">
              <div className="dtc w2 w3-ns v-mid">
                <img
                  style={{ height: '40px' }}
                  src="https://tigrowresources.s3-ap-southeast-1.amazonaws.com/files-and-folders.svg"
                  className="db h2 h3-ns"
                />
              </div>
              <div className="dtc v-mid pl3 mw6">
                <h1 className="f5 black mv0">
                  {pending.company.name}
                </h1>
                <h1 className="f6 f5-ns fw6 lh-title black mt3 mb0">
                  {pending.project.name}
                </h1>
                <h2 className="f6 fw4 mt0 mb0 black-60">
                  {pending.project.description}
                </h2>
              </div>
              <div className="dtc v-mid">
                <form className="w-100 tr">
                  <Button
                    className="w4 grow h2 pointer bp3-minimal mr4"
                    style={{
                      border: '1px solid silver',
                      outline: 'none',
                    }}
                    type="submit"
                    loading={rejectLoading}
                    onClick={async () => {
                      setRejectLoading(true);
                      await props.rejectPendingProject(
                        pending.project._id,
                      );
                      setRejectLoading(false);
                    }}
                  >
                    Reject
                  </Button>
                  <Button
                    className="w4 grow h2 pointer"
                    style={{
                      background: '#0fa3a3',
                      outline: 'none',
                      color: 'white',
                      border: 'none',
                    }}
                    type="submit"
                    loading={acceptLoading}
                    onClick={async () => {
                      setAcceptLoading(true);
                      await props.acceptPendingProject(
                        pending
                      );
                      setAcceptLoading(false);
                    }}
                  >
                    Accept
                  </Button>
                </form>
              </div>
            </article>
            <Divider />
          </main>
        ))
        :
        (
          <h1 className="f5 fw4">No pending Projects</h1>
        )
      ) : (
          <Loading />
        )}
    </div>
  );
};

const mapStateToProps = (state: any) => {
  return {
    companyRole: state.companyReducer.currentCompany.role,
    PendingProjects: state.projectReducer.pendingProjects,
  };
};

export const PendingProjectRequest = connect(mapStateToProps, {
  getAllPendingProjects,
  acceptPendingProject,
  rejectPendingProject,
})(withRouter(ProjectRequestComponent));
