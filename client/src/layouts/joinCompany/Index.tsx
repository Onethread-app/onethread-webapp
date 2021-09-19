import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import { isAuthenticate } from 'stores/UtilsActions';
import { Toaster } from '@blueprintjs/core';
import {
  getCompanyPublicInformation,
  requestToJoinCompanyStart,
} from 'stores/company/Actions';
import SuspenseLoader from 'components/loader/SuspenseLoader';
// import { useTranslation } from 'react-i18next';

// interface IProps {
//   //   joinCompany: (arg0: string) => void;
//   getCompanyPublicInformation: (arg0: string) => void;
//   errorGettingCompanyDetails: boolean;
// }

const Index = ({ match, ...props }) => {
  const history = useHistory();
  const companyId = match.params.companyId;

  useEffect(() => {
    if (companyId) {
      localStorage.setItem(
        'companyToJoin',
        JSON.stringify(companyId),
      );
      //   props.getCompanyPublicInformation(companyId);
      if (isAuthenticate()) {
        props.requestToJoinCompanyStart(companyId);
      } else {
        history.push('/signup');
      }
    } else {
      Toaster.create().show({
        message: `No company id found`,
        timeout: 3000,
        intent: 'danger',
      });
      history.push('/signup');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyId]);

  useEffect(() => {
    if (props.companyJoinRequestFailed) {
      Toaster.create().show({
        message: `Company not found.`,
        timeout: 3000,
        intent: 'danger',
      });
      history.push('/');
    }
    if (
      !props.companyJoinRequestLoading &&
      props.companyJoinRequestFailed === ''
    ) {
      localStorage.removeItem('companyToJoin');
      history.push('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    props.companyJoinRequestFailed,
    props.companyJoinRequestLoading,
  ]);

  return <SuspenseLoader />;
};

const mapStateToProps = (state: any) => ({
  companyJoinRequestFailed:
    state.companyReducer.companyJoinRequestFailed,
  companyJoinRequestLoading:
    state.companyReducer.companyJoinRequestLoading,
});

export default connect(mapStateToProps, {
  getCompanyPublicInformation,
  requestToJoinCompanyStart,
})(Index);
