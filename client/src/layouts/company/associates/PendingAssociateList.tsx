import React, { useEffect, useState } from 'react';
import { Button, Divider } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import {
  getAllPendingAssociates,
  acceptPendingAssociate,
  rejectPendingAssociate,
} from 'stores/associate/Actions';
import { Loading } from 'components/Loading';
import { ICompany } from 'stores/company/Reducer';
import { Associate } from 'stores/associate/Reducer';

interface AssociatesPageComponentProps {
  company: ICompany;
  pendingAssociates: Associate[];
  getAllPendingAssociates: () => void;
  acceptPendingAssociate: (associateId: string) => void;
  rejectPendingAssociate: (associateId: string) => void;
}

export const PendingAssociateListComponent = (
  props: AssociatesPageComponentProps & RouteComponentProps,
) => {
  const [loading, setLoading] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  useEffect(() => {
    async function loadAssociates(getPendingAssociates: () => void) {
      setLoading(true);
      await getPendingAssociates();
      setLoading(false);
    }
    loadAssociates(props.getAllPendingAssociates);
  }, []);

  return (
    <>
      <div className="br3 bg-white pa4-ns pa2 cf flex w-100">
        <div className="w-100">
          {loading ? (
            <Loading />
          ) : props.pendingAssociates.length > 0 ? (
            props.pendingAssociates.map((associate: Associate) => (
              <>
                <article className="dt w-100 pv3 mt2">
                  <div className="dtc w2 w3-ns v-mid">
                    {associate.associateCompany.logo ? (
                      <img
                        src={`${associate.associateCompany.logo}`}
                        alt="company logo"
                        className="ba b--black-10 db br-100 w2 w3-ns h2 h3-ns "
                      />
                    ) : (
                      <h1 className="ba b--black-10 db br-100 w2 w3-ns h2 h3-ns tc pt2 bg-green white">
                        {associate.associateCompany
                          ? associate.associateCompany.name.charAt(0)
                          : 'Demo'}
                      </h1>
                    )}
                  </div>
                  <div className="dtc v-mid pl3 mw6">
                    <h1 className="f5 black mv0">
                      {associate.associateCompany.name}
                    </h1>
                    <h2
                      className="f6 fw4 mt0 mb0 black-60 ttc ws-break overflow-hidden nowrap mt2"
                      style={{
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {associate.associateCompany.about}
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
                        text="Reject"
                        loading={rejectLoading}
                        onClick={async () => {
                          setRejectLoading(true);
                          await props.rejectPendingAssociate(
                            associate._id,
                          );
                          setRejectLoading(false);
                        }}
                      />
                      <Button
                        className="w4 grow h2 pointer"
                        style={{
                          background: '#0fa3a3',
                          outline: 'none',
                          color: 'white',
                          border: 'none',
                        }}
                        text="Accept"
                        loading={acceptLoading}
                        onClick={async () => {
                          setAcceptLoading(true);
                          await props.acceptPendingAssociate(
                            associate._id,
                          );
                          setAcceptLoading(false);
                        }}
                      />
                    </form>
                  </div>
                </article>
                <Divider />
              </>
            ))
          ) : (
            <p>No pending request available</p>
          )}
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany,
    pendingAssociates: state.associateReducer.pendingAssociates,
  };
};

export const PendingAssociateList = connect(mapStateToProps, {
  getAllPendingAssociates,
  acceptPendingAssociate,
  rejectPendingAssociate,
})(withRouter(PendingAssociateListComponent));
