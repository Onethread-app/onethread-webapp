import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';

import { isAuthenticate } from 'stores/UtilsActions';
import { Toaster } from '@blueprintjs/core';
import {
  getCompanyPublicInformation,
  requestToJoinCompanyStart,
} from 'stores/company/Actions';
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
    if (props.companyJoinRequestSuccess) {
      localStorage.removeItem('companyToJoin');
      history.push('/');
    }
  }, [
    history,
    props.companyJoinRequestFailed,
    props.companyJoinRequestSuccess,
  ]);

  return <div></div>;
};

const mapStateToProps = (state: any) => ({
  companyJoinRequestFailed:
    state.companyReducer.companyJoinRequestFailed,
  companyJoinRequestSuccess:
    state.companyReducer.companyJoinRequestSuccess,
});

export default connect(mapStateToProps, {
  getCompanyPublicInformation,
  requestToJoinCompanyStart,
})(Index);
