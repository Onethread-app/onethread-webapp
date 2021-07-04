import React, { useState } from 'react';
import { InputGroupField } from 'components/fields/InputGroupField';
import { isEmpty, isEqual, pickBy } from 'lodash';
import { Button, Spinner } from '@blueprintjs/core';
import { withRouter, RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import {
  createCompanyAction,
  clearErrorOnCompanyCreate,
} from 'stores/company/Actions';
import { useTranslation } from 'react-i18next';

// const Type = [
//   'Manufacturer',
//   'Trading Company',
//   'Buying Office',
//   'Agent',
//   'Distributor/Wholesaler',
//   'Government ministry/Bureau/Commission',
//   'Association',
//   'Business Service (Transportation, finance, travel, Ads, etc)',
//   'Other',
// ];

const CompanySignupFormComponent = (
  props: {
    setShowDialog: (val: boolean) => void;
    createCompanyAction: (val: any) => void;
    clearErrorOnCompanyCreate: () => void;
    companyName: string;
    creatingCompany: boolean;
    errorOnCreatingCompany: string;
  } & RouteComponentProps,
) => {
  const [currentCompanyName, setCurrentCompanyName] = useState('');
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    name: '',
    email: '',
    legalOwnerName: '',
    legalOwnerMail: '',
    address: '',
    type: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    legalOwnerName: '',
    email: '',
    legalOwnerMail: '',
    address: '',
    type: '',
  });

  React.useEffect(() => {
    setCurrentCompanyName(props.companyName);
    return () => {
      props.clearErrorOnCompanyCreate();
    };
  }, []);

  React.useEffect(() => {
    if (
      loading &&
      props.creatingCompany === false &&
      props.errorOnCreatingCompany === '' &&
      props.companyName !== currentCompanyName
    ) {
      setLoading(false);
      props.setShowDialog(false);
      props.history.push(`/company/${props.companyName}/dashboard`);
    }
  }, [props.creatingCompany]);

  React.useEffect(() => {
    if (props.errorOnCreatingCompany) {
      setLoading(false);
    }
  }, [props.errorOnCreatingCompany]);

  const emailValidation = (email: string) => {
    if (email !== '') {
      const regexForEmailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (email.match(regexForEmailValidation)) {
        return true;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  const emptyValueCheck = () => {
    if (
      isEmpty(values.name) 
    ) {
      let e = errors;
      if (isEmpty(values.name)) {
        e = { ...e, name: 'Required' };
      }
      setErrors(e);
      return true;
    } else {
      return false;
    }
  };

  const emptyErrorCheck = () => {
    if (
      isEmpty(errors.name) &&
      isEmpty(errors.address) &&
      isEmpty(errors.type) &&
      isEmpty(errors.email) &&
      isEmpty(errors.legalOwnerMail) &&
      isEmpty(errors.legalOwnerName)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const handleChange = (name: string) => (event: any) => {
    const value = event.target.value;
    setValues({ ...values, [name]: value });
  };

  // const onChangeSelectField = (name: string) => (event: any) => {
  //   const value = event.currentTarget.value;
  //   setValues({ ...values, [name]: value });
  //   setErrors({ ...errors, [name]: '' });
  // };

  const checkLegalOwnerMail = () => {
    if (isEqual(values.email, values.legalOwnerMail)) {
      return true;
    } else {
      return false;
    }
  };

  const handleCreateCompany = async (e: any) => {
    e.preventDefault();
    if (!emptyValueCheck() && emptyErrorCheck()) {
      setLoading(true);
      await props.createCompanyAction(
        pickBy(values, (v) => v !== ''),
      );
    }
  };

  const { t } = useTranslation();

  return (
    <form className="fl w-100 pa4">
      <h1 className="f5 lh-title ml2 tigrow-lightBlue mb4">
        {t('app.forms.Create-company.Create')}
        {/* Create Company */}
      </h1>
      <div className={` ${errors.name ? 'mb3' : 'mb4'}`}>
        <div className="flex">
          <InputGroupField
            id="companyName"
            value={values.name}
            onChange={handleChange('name')}
            placeHolder={`${t('app.forms.Create-company.Name')} (Required)`}
            // placeHolder="Company Name (Required)"
            leftIcon="briefcase"
            style={{
              boxShadow: 'none',
            }}
            className={`br0 ${
              errors.name ? 'bb b--red' : 'bb b--lightBlue'
            }`}
            leftIconColor={`${errors.name ? 'red' : '#3F61C5'}`}
            validationOnBlur={() => {
              if (isEmpty(values.name)) {
                const companyNameError = {
                  ...errors,
                  name: 'Please enter company name',
                };
                setErrors(companyNameError);
              } else if (values.name.length > 32) {
                const companyNameError = {
                  ...errors,
                  name:
                    'Company name must be less than 32 character.',
                };
                setErrors(companyNameError);
              } else {
                const companyNameError = { ...errors, name: '' };
                setErrors(companyNameError);
              }
            }}
          />
        </div>
        {errors.name ? (
          <small style={{ color: 'red' }}>{errors.name}</small>
        ) : (
          ''
        )}
        {props.errorOnCreatingCompany && (
          <small style={{ color: 'red' }}>
            {props.errorOnCreatingCompany}
          </small>
        )}
      </div>
      <div className={` ${errors.address ? 'mb3' : 'mb4'}`}>
        <div className="flex">
          <InputGroupField
            id="companyAddress"
            value={values.address}
            onChange={handleChange('address')}
            placeHolder={t('app.forms.Create-company.Address')}
            // placeHolder="Company Address"
            leftIcon="map-marker"
            style={{
              boxShadow: 'none',
            }}
            className={`br0 ${
              errors.address ? 'bb b--red' : 'bb b--lightBlue'
            }`}
            leftIconColor={`${errors.address ? 'red' : '#3F61C5'}`}
            // validationOnBlur={() => {
            //   if (isEmpty(values.address)) {
            //     const companyAddressError = {
            //       ...errors,
            //       address: 'Please enter company address',
            //     };
            //     setErrors(companyAddressError);
            //   } else if (values.address.length > 120) {
            //     const companyAddressError = {
            //       ...errors,
            //       address:
            //         'Company address must be less than 120 character.',
            //     };
            //     setErrors(companyAddressError);
            //   } else {
            //     const companyAddressError = {
            //       ...errors,
            //       address: '',
            //     };
            //     setErrors(companyAddressError);
            //   }
            // }}
          />
        </div>
        {errors.address ? (
          <small style={{ color: 'red' }}>{errors.address}</small>
        ) : (
          ''
        )}
      </div>

      {/* <div className={` ${errors.type ? 'mb3' : 'mb4'}`}>
        <div className="flex">
          <div className=" f5 pa1 bb b--lightBlue">
            <Icon icon={'briefcase'} className="tigrow-lightBlue" />
          </div>
          <HTMLSelect
            fill={true}
            minimal={true}
            onChange={onChangeSelectField('type')}
            className=" bb b--lightBlue"
            style={{
              boxShadow: 'none',
              borderRadius: '0px',
              backgroundColor: 'white',
              flex: '1',
              outline: 'none',
            }}
          >
            <option selected value="">
              Select a company type (Required)
            </option>
            {Type.map((t) => (
              <option value={t}>{t}</option>
            ))}
          </HTMLSelect>
        </div>
        {errors.type ? (
          <small style={{ color: 'red' }}>{errors.type}</small>
        ) : (
          ''
        )}
      </div> */}

      <div className={` ${errors.email ? 'mb3' : 'mb4'}`}>
        <div className="flex">
          <InputGroupField
            id="companyMail"
            value={values.email}
            onChange={handleChange('email')}
            placeHolder={t('app.forms.Create-company.Email')}
            // placeHolder="Company Email Address"
            leftIcon="envelope"
            style={{
              boxShadow: 'none',
            }}
            className={`br0 ${
              errors.email ? 'bb b--red' : 'bb b--lightBlue'
            }`}
            leftIconColor={`${errors.email ? 'red' : '#3F61C5'}`}
            validationOnBlur={() => {
              if (checkLegalOwnerMail() && !isEmpty(values.email)) {
                const companyEmailError = {
                  ...errors,
                  email:
                    'Company email address and legal owner mail address must be different',
                };
                setErrors(companyEmailError);
              } else if (!emailValidation(values.email)) {
                const companyEmailError = {
                  ...errors,
                  email: 'Invalid email address!',
                };
                setErrors(companyEmailError);
              } else {
                const companyEmailError = { ...errors, email: '' };
                setErrors(companyEmailError);
              }
            }}
          />
        </div>
        {errors.email ? (
          <small style={{ color: 'red' }}>{errors.email}</small>
        ) : (
          ''
        )}
      </div>

      <div className="mb4">
        <div className="flex">
          <InputGroupField
            id="legalOwnerName"
            value={values.legalOwnerName}
            onChange={handleChange('legalOwnerName')}
            placeHolder={t('app.forms.Create-company.Legal-name')}
            // placeHolder="Legal Owner's Name"
            leftIcon="mugshot"
            style={{
              boxShadow: 'none',
            }}
            className={'br0 bb b--lightBlue'}
            leftIconColor="#3F61C5"
            validationOnBlur={() => {
              if (values.legalOwnerName.length > 32) {
                const legalOwnerNameError = {
                  ...errors,
                  legalOwnerName:
                    'legal owner name must be less than 32 character.',
                };
                setErrors(legalOwnerNameError);
              } else {
                const legalOwnerNameError = {
                  ...errors,
                  legalOwnerName: '',
                };
                setErrors(legalOwnerNameError);
              }
            }}
          />
        </div>
        {errors.legalOwnerName && (
          <small style={{ color: 'red' }}>
            {errors.legalOwnerName}
          </small>
        )}
      </div>

      <div className={` ${errors.legalOwnerMail ? 'mb3' : 'mb4'}`}>
        <div className="flex">
          <InputGroupField
            id="legalOwnerMail"
            value={values.legalOwnerMail}
            onChange={handleChange('legalOwnerMail')}
            placeHolder={t('app.forms.Create-company.Legal-email')}
            // placeHolder="Legal Owner's Email Address"
            leftIcon="envelope"
            style={{
              boxShadow: 'none',
            }}
            className={`br0 ${
              errors.legalOwnerMail ? 'bb b--red' : 'bb b--lightBlue'
            }`}
            leftIconColor={`${
              errors.legalOwnerMail ? 'red' : '#3F61C5'
            }`}
            validationOnBlur={() => {
              if (
                checkLegalOwnerMail() &&
                !isEmpty(values.legalOwnerMail)
              ) {
                const ownerEmailError = {
                  ...errors,
                  legalOwnerMail:
                    'Company email address and legal owner mail address must be different',
                };
                setErrors(ownerEmailError);
              } else if (!emailValidation(values.legalOwnerMail)) {
                const ownerEmailError = {
                  ...errors,
                  legalOwnerMail: 'Invalid email address!',
                };
                setErrors(ownerEmailError);
              } else {
                const ownerEmailError = {
                  ...errors,
                  legalOwnerMail: '',
                };
                setErrors(ownerEmailError);
              }
            }}
          />
        </div>
        {errors.legalOwnerMail ? (
          <small style={{ color: 'red' }}>
            {errors.legalOwnerMail}
          </small>
        ) : (
          ''
        )}
      </div>
      <div className="flex justify-end">
        <Button
          className="w4 grow h2 pointer mr3"
          style={{
            background: '#fff',
            outline: 'none',
            border: '1px solid #3F61C5',
            color: '#3F61C5',
          }}
          onClick={(e: any) => {
            e.preventDefault();
            props.setShowDialog(false);
            setLoading(false);
          }}
        >
          cancel
        </Button>
        <Button
          type="submit"
          className="w4 grow h2 pointer"
          style={{
            background: '#3F61C5',
            outline: 'none',
            color: 'white',
          }}
          onClick={async (e: any) => {
            await handleCreateCompany(e);
          }}
          disabled={loading}
        >
          {loading ? <Spinner size={15} /> : 'Save'}
        </Button>
      </div>
    </form>
  );
};

const mapStateToProps = (state: any) => {
  return {
    companyName: state.companyReducer.currentCompany.uniqueName,
    creatingCompany: state.companyReducer.creatingCompany,
    errorOnCreatingCompany:
      state.companyReducer.errorOnCreatingCompany,
  };
};

export const CompanySignupForm = connect(mapStateToProps, {
  createCompanyAction,
  clearErrorOnCompanyCreate,
})(withRouter(CompanySignupFormComponent));
