import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import { isAuthenticate } from 'stores/UtilsActions';
import { Toaster } from '@blueprintjs/core';
import {
  getCompanyPublicInformation,
  requestToJoinCompanyStart,
} from 'stores/company/Actions';
import SuspenseLoader from 'components/loader/SuspenseLoader';

const Index = ({ match, ...props }) => {
  const history = useHistory();
  const companyId = match.params.companyId;
  const [companyJoinError, setCompanyJoinError] =
    useState<boolean>(false);

  useEffect(() => {
    if (companyId) {
      localStorage.setItem(
        'companyToJoin',
        JSON.stringify(companyId),
      );
      if (isAuthenticate()) {
        props.requestToJoinCompanyStart(companyId);
      } else {
        history.push('/signup');
      }
    } else {
      setCompanyJoinError(true);
      history.push('/signup');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  useEffect(() => {
    if (
      props.companyJoinRequestLoading === false &&
      props.companyJoinRequestFailure !== ''
    ) {
      setCompanyJoinError(true);
      localStorage.removeItem('companyToJoin');
      history.push('/signup');
    }
    if (
      props.companyJoinRequestLoading === false &&
      props.companyJoinRequestFailure === ''
    ) {
      localStorage.removeItem('companyToJoin');
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.companyJoinRequestFailure,
    props.companyJoinRequestLoading,
  ]);

  return (
    <>
      <SuspenseLoader />
      {companyJoinError &&
        Toaster.create().show({
          message: 'There was an error trying to join the company',
          intent: 'danger',
          timeout: 3000,
        })}
    </>
  );
};

const mapStateToProps = (state: any) => ({
  companyJoinRequestFailure:
    state.companyReducer.companyJoinRequestFailure,
  companyJoinRequestLoading:
    state.companyReducer.companyJoinRequestLoading,
});

export default connect(mapStateToProps, {
  getCompanyPublicInformation,
  requestToJoinCompanyStart,
})(Index);
