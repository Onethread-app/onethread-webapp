import React, { useState } from 'react';
import { Button, Dialog } from '@blueprintjs/core';
import { InputGroupField } from 'components/fields/InputGroupField';
import { connect } from 'react-redux';
import {
  changeCompanyName,
  clearChangeCompanyNameError,
} from '../../../../stores/company/Actions';
import { ICompany } from 'stores/company/Reducer';
import { RouteComponentProps, withRouter } from 'react-router';
import { isEqual, isEmpty } from 'lodash';
import { History } from 'history';
import { companyPermit } from 'stores/UtilsActions';
import { useTranslation } from 'react-i18next';

interface DetailsViewProps {
  company: ICompany;
  changeCompanyName: (name: string) => void;
  clearChangeCompanyNameError: () => void;
  errorCompanyName: string;
  changeCompanyNameLoading: boolean;
  history: History;
}

const GeneralViewComponent = (
  props: DetailsViewProps & RouteComponentProps,
) => {
  const [companyName, setCompanyName] = useState(props.company.name);
  const [errors, setErrors] = useState('');

  const [showDialog, setShowDialog] = useState(false);

  const { t } = useTranslation();

  return (
    <div className="fl w-100">
      <div className="fl w-100 pr3">
        <div className="fl w-100 w-50-m w-60-l">
          <p className="b">{t('app.company.Company-profile.Name')}</p>
          {/* <p className="b">Company Name</p> */}
          <p className="mb0 f4-ns f6">{props.company.name}</p>
        </div>
        {companyPermit(props.company.role) &&
          isEqual(props.company.role, 'superAdmin') && (
            <div className="fl w-100 w-50-m w-40-l mv4">
              <Button
                type="submit"
                className="grow pointer outline-0 shadow-0 h2 changecompanybutton"
                text={t('app.company.Settings.Change-Name')}
                // text="Change Company Name"
                style={{
                  background: '#34b3e9',
                  color: 'white',
                }}
                onClick={() => setShowDialog(true)}
              />
            </div>
          )}
      </div>

      {showDialog && (
        <Dialog
          onClose={() => setShowDialog(!showDialog)}
          isOpen
          style={{ background: '#fff' }}
          canOutsideClickClose={false}
          className="ma2"
        >
          <form className="pa4">
            <h1 className="f5 lh-title ml2 tigrow-lightBlue mb4">
              {t('app.company.Settings.Change-Name')}
              {/* Change Company Name */}
            </h1>
            <div>
              {props.errorCompanyName ? (
                <small className="red">
                  {props.errorCompanyName}
                </small>
              ) : (
                ''
              )}
              <div className={`${errors ? 'mb3' : 'mb4'}`}>
                <div className="flex">
                  <InputGroupField
                    id="companyName"
                    value={companyName}
                    leftIcon="envelope"
                    className={`br0 ${
                      errors || props.errorCompanyName
                        ? 'bb b--red'
                        : 'bb b--lightBlue'
                    }`}
                    leftIconColor={`${
                      errors || props.errorCompanyName
                        ? 'red'
                        : '#34b3e9'
                    }`}
                    style={{
                      boxShadow: 'none',
                    }}
                    onChange={(event: any) => {
                      setCompanyName(event.target.value);
                    }}
                    validationOnBlur={() => {
                      if (isEmpty(companyName)) {
                        setErrors('Required');
                      } else if (companyName.length > 32) {
                        setErrors(
                          'Company name must be less than 32 character.',
                        );
                      } else {
                        setErrors('');
                      }
                    }}
                  />
                </div>
                {errors ? (
                  <small className="red">{errors}</small>
                ) : (
                  ''
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="w4 grow h2 pointer mr3"
                style={{
                  background: '#34b3e9',
                  outline: 'none',
                  color: 'white',
                }}
                onClick={async (e: any) => {
                  e.preventDefault();
                  if (
                    isEqual(props.company.name, companyName) === true
                  ) {
                    props.clearChangeCompanyNameError();
                    setShowDialog(false);
                  } else if (isEmpty(errors)) {
                    const response = (await props.changeCompanyName(
                      companyName
                    )) as any;
                    if (response && props.changeCompanyNameLoading === false) {
                      props.history.push(
                        `/company/${companyName}/settings`,
                      );
                      setShowDialog(false);
                    }
                  }
                }}
              >
                Change
              </Button>
              <Button
                className="w4 grow h2 pointer"
                style={{
                  background: '#fff',
                  outline: 'none',
                  border: '1px solid #34b3e9',
                  color: '#34b3e9',
                }}
                onClick={(e: any) => {
                  e.preventDefault();
                  setShowDialog(false);
                  setErrors('');
                  setCompanyName(props.company.name);
                  props.clearChangeCompanyNameError();
                }}
              >
                cancel
              </Button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
};
const mapStateToProps = (state: any) => {
  return {
    company: state.companyReducer.currentCompany,
    errorCompanyName: state.companyReducer.error,
    changeCompanyNameLoading:
      state.companyReducer.changeCompanyNameLoading,
  };
};

export const GeneralView = connect(mapStateToProps, {
  changeCompanyName,
  clearChangeCompanyNameError,
})(withRouter(GeneralViewComponent));
