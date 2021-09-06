import React, { useState, useEffect } from 'react';
import { Tabs, Tab, Divider } from '@blueprintjs/core';
import { connect } from 'react-redux';
import { AssociateBasicInfoView } from './AssociateBasicInfoView';
import { BreadCrumbs } from 'components/fields/Breadcrumbs';
import { ICompany } from 'stores/company/Reducer';
import { Loading } from 'components/Loading';
import { getSelectedAssociate } from 'stores/associate/Actions';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { Associate } from 'stores/associate/Reducer';

interface AssociatesDetailsViewInternalProps {
  company: ICompany;
  associate: Associate;
  getSelectedAssociate: (id: string) => void;
}

const AssociatesDetailsViewComponent = (
  props: AssociatesDetailsViewInternalProps & RouteComponentProps,
) => {
  const [loading, setLoading] = useState(false);
  const associateId = (props.match.params as any).associateId;

  useEffect(() => {
    async function loadAssociate() {
      setLoading(true);
      await props.getSelectedAssociate(associateId);
      setLoading(false);
    }
    loadAssociate();
  }, [props.company._id]);

  return (
    <>
      {loading === true || isEmpty(props.associate._id) === true ? (
        <Loading />
      ) : (
        <div className="bg-white br3 ph5-ns ph4">
          <div className="pv4">
            <BreadCrumbs
              items={[
                {
                  text: `My Partners`,
                  href: `/company/${props.company.uniqueName}/associates`,
                },
                {
                  text: `${props.associate.associateCompany.name}`,
                  href: `/company/${props.company.uniqueName}/associate/${props.associate._id}`,
                },
              ]}
            />
          </div>
          <div className="flex mb4">
            {props.associate &&
            props.associate.associateCompany.logo ? (
              <img
                className="w3 h3 mr4"
                src={`${props.associate.associateCompany.logo}`}
                alt="company logo"
              />
            ) : (
              <h1 className="white f3 bg-green w3 h3 tc pt3 br3">
                {props.associate
                  ? props.associate.associateCompany.name.charAt(0)
                  : 'Demo'}
              </h1>
            )}
            <div className="ml4">
              <h1 className="f3 mv0">
                {props.associate.associateCompany.name}
              </h1>
              <h1 className="silver f7 mv0 fw5">{`Added by ${props.associate.account.firstName} ${props.associate.account.lastName}`}</h1>
              <h1 className="f7 mv0 pt3 fw6">
                Added on{' '}
                {moment(props.associate.createdAt).format(
                  'MMMM Do YYYY',
                )}
              </h1>
            </div>
          </div>
          <Divider />
          <Tabs id="TabsExample">
            <Tab
              id="associates_basic_info"
              title="Basic Information"
              panel={
                <AssociateBasicInfoView
                  company={props.associate.associateCompany}
                />
              }
              className="outline-0 mt4"
            />
          </Tabs>
        </div>
      )}
    </>
  );
};

const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany,
    associate: state.associateReducer.currentAssociate,
  };
};

export const AssociatesDetailsView = connect(mapStateToProps, {
  getSelectedAssociate,
})(withRouter(AssociatesDetailsViewComponent));

export default AssociatesDetailsView;
