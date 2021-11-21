import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isNumber, isEmpty, isEqual } from 'lodash';
import { connect } from 'react-redux';

// import { Icon } from '@blueprintjs/core/lib/esm/components/icon/icon';
import { HTMLSelect } from '@blueprintjs/core/lib/esm/components/html-select/htmlSelect';
import { Button } from '@blueprintjs/core/lib/esm/components/button/buttons';
import '@blueprintjs/datetime/lib/css/blueprint-datetime.css';

import { ICompany } from 'stores/company/Reducer';
import { editCompanyInfoAction } from 'stores/company/Actions';
import { saveCompanyBasicInfoForm } from 'stores/companyBasicInfoForm/Actions';

import { InputGroupFieldWithLabel } from 'components/fields/InputGroupField';

interface CompanyInfoProps {
  companyInfo: ICompany;
  saveCompanyBasicInfoForm: any;
  previousData: any;
}

const Type = [
  'Manufacturer',
  'Trading Company',
  'Buying Office',
  'Agent',
  'Distributor/Wholesaler',
  'Government ministry/Bureau/Commission',
  'Association',
  'Business Service (Transportation, finance, travel, Ads, etc)',
  'Other',
];

const CompanyInfoFormComponent = (
  props: {
    // should use CompanyBasicInfo interface
    editCompanyInfoAction: (val: any) => void;
    setShowDialog: (val: boolean) => void;
  } & CompanyInfoProps,
) => {
  const { t } = useTranslation();
  const [data, setData] = useState<any>([]);
  const [values, setValues] = useState({
    name: props.companyInfo.name,
    type: props.companyInfo.type,
    address: props.companyInfo.address,
    email: props.companyInfo.email,
    legalOwnerName: props.companyInfo.legalOwnerName,
    legalOwnerMail: props.companyInfo.legalOwnerMail,
  });

  const [errors, setErrors] = useState({
    name: '',
    type: '',
    address: '',
    email: '',
    legalOwnerName: '',
    legalOwnerMail: '',
  });

  const emailValidation = (email: string) => {
    const regexForEmailValidation =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (email && email.match(regexForEmailValidation)) {
      return true;
    } else {
      return false;
    }
  };

  const emptyErrorCheck = () => {
    if (
      isEmpty(errors.legalOwnerMail) &&
      isEmpty(errors.email) &&
      isEmpty(errors.address) &&
      isEmpty(errors.legalOwnerName)
    ) {
      return true;
    } else {
      return false;
    }
  };

  const emptyValueCheck = () => {
    if (isEmpty(values.address)) {
      let e = errors;
      if (isEmpty(values.address)) {
        e = { ...e, address: 'Required' };
      }
      setErrors(e);
      return true;
    } else {
      return false;
    }
  };

  const handleChange = (name: string | number) => (event: any) => {
    const value = isNumber(event)
      ? event.toString()
      : event.target.value;
    setValues({ ...values, [name]: value });
    setData({ ...values, [name]: value });
  };

  const onChangeSelectField = (name: string) => (event: any) => {
    const value = event.currentTarget.value;
    setValues({ ...values, [name]: value });
    setData({ ...values, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const checkLegalOwnerMail = () => {
    if (isEqual(values.email, values.legalOwnerMail)) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    setValues({
      name: props.previousData.name,
      type: props.previousData.type,
      address: props.previousData.address,
      email: props.previousData.email,
      legalOwnerName: props.previousData.legalOwnerName,
      legalOwnerMail: props.previousData.legalOwnerMail,
    });
  }, []);

  useEffect(() => {
    props.saveCompanyBasicInfoForm(data);
  }, [data]);

  return (
    <form className="fl w-100 pa4">
      <h1 className="f5 lh-title mb3">
        {t('app.company.Company-profile.Basic')}
      </h1>
      <div className={` ${errors.name ? 'mb2' : 'mb3'}`}>
        <InputGroupFieldWithLabel
          id="name"
          value={values.name}
          onChange={handleChange('name')}
          placeHolder={`${t('app.forms.Create-company.Name')}`}
          // leftIcon="user"
          style={{
            boxShadow: 'none',
            height: '2.5rem',
          }}
          readOnly={true}
          className={`br2 ${
            errors.name ? 'ba b--red' : 'ba b--black-40'
          }`}
          validationOnBlur={() => {
            if (isEmpty(values.name)) {
              const nameError = { ...errors, name: 'Required' };
              setErrors(nameError);
            } else if (values.name && values.name.length > 120) {
              const nameError = {
                ...errors,
                name: 'Company name must be less than 32 character.',
              };
              setErrors(nameError);
            } else {
              const nameError = { ...errors, name: '' };
              setErrors(nameError);
            }
          }}
          label={`${t('app.forms.Create-company.Name-not-required')}`}
        />
        {errors.name ? (
          <small style={{ color: 'red' }}>{errors.name}</small>
        ) : (
          ''
        )}
      </div>
      <div className={` ${errors.type ? 'mb2' : 'mb3'}`}>
        <div className="flex flex-column">
          <div className="fw5" style={{ fontSize: '.8rem' }}>
            {t('app.company.Company-profile.Type')}
          </div>
          <HTMLSelect
            fill={true}
            minimal={true}
            onChange={onChangeSelectField('type')}
            className="br2 ba b--black-40"
            style={{
              boxShadow: 'none',
              borderRadius: '0px',
              backgroundColor: 'white',
              flex: '1',
              outline: 'none',
              height: '2.5rem',
            }}
          >
            <option selected value={values.type}>
              {values.type
                ? values.type
                : `Select a company type (Required)`}
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
      </div>
      <div className={` ${errors.address ? 'mb2' : 'mb3'}`}>
        <InputGroupFieldWithLabel
          id="address"
          value={values.address}
          onChange={handleChange('address')}
          placeHolder={`${t(
            'app.forms.Create-company.Address',
          )} (Required)`}
          style={{
            boxShadow: 'none',
            height: '2.5rem',
          }}
          className={`br2 ${
            errors.address ? 'ba b--red' : 'ba b--black-40'
          }`}
          validationOnBlur={() => {
            if (isEmpty(values.address)) {
              const addressError = { ...errors, address: 'Required' };
              setErrors(addressError);
            } else if (
              values.address &&
              values.address.length > 120
            ) {
              const addressError = {
                ...errors,
                address:
                  'Company address must be less than 120 character.',
              };
              setErrors(addressError);
            } else {
              const addressError = { ...errors, address: '' };
              setErrors(addressError);
            }
          }}
          label={`${t('app.forms.Create-company.Address')}`}
        />
        {errors.address ? (
          <small style={{ color: 'red' }}>{errors.address}</small>
        ) : (
          ''
        )}
      </div>
      <div className={` ${errors.email ? 'mb2' : 'mb3'}`}>
        <InputGroupFieldWithLabel
          id="email"
          value={values.email}
          onChange={handleChange('email')}
          placeHolder={t('app.forms.Create-company.Email')}
          style={{
            boxShadow: 'none',
            height: '2.5rem',
          }}
          className={`br2 ${
            errors.email ? 'ba b--red' : 'ba b--black-40'
          }`}
          validationOnBlur={() => {
            if (checkLegalOwnerMail() && !isEmpty(values.email)) {
              const companyEmailError = {
                ...errors,
                email:
                  'Company email address and legal owner mail address must be different',
              };
              setErrors(companyEmailError);
            } else if (
              !isEmpty(values.email) &&
              !emailValidation(values.email)
            ) {
              const emailError = {
                ...errors,
                email: 'Invalid email address!',
              };
              setErrors(emailError);
            } else {
              const emailError = { ...errors, email: '' };
              setErrors(emailError);
            }
          }}
          label={t('app.forms.Create-company.Email')}
        />
        {errors.email ? (
          <small style={{ color: 'red' }}>{errors.email}</small>
        ) : (
          ''
        )}
      </div>
      <div className={` ${errors.legalOwnerName ? 'mb2' : 'mb3'}`}>
        <InputGroupFieldWithLabel
          id="legalOwnerName"
          value={values.legalOwnerName}
          onChange={handleChange('legalOwnerName')}
          placeHolder={t('app.forms.Create-company.Legal-name')}
          style={{
            boxShadow: 'none',
            height: '2.5rem',
          }}
          className={`br2 ${
            errors.legalOwnerName ? 'ba b--red' : 'ba b--black-40'
          }`}
          validationOnBlur={() => {
            if (
              values.legalOwnerName &&
              values.legalOwnerName.length > 32
            ) {
              const legalOwnerNameError = {
                ...errors,
                legalOwnerName:
                  'Legal Owner Name must be less than 32 character.',
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
          label={t('app.forms.Create-company.Legal-name')}
        />
        {errors.legalOwnerName ? (
          <small style={{ color: 'red' }}>
            {errors.legalOwnerName}
          </small>
        ) : (
          ''
        )}
      </div>
      <div className={` ${errors.legalOwnerMail ? 'mb2' : 'mb3'}`}>
        <InputGroupFieldWithLabel
          id="legalOwnerMail"
          value={values.legalOwnerMail}
          onChange={handleChange('legalOwnerMail')}
          placeHolder={t('app.forms.Create-company.Legal-email')}
          style={{
            boxShadow: 'none',
            height: '2.5rem',
          }}
          className={`br2 ${
            errors.legalOwnerMail ? 'ba b--red' : 'ba b--black-40'
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
            } else if (
              !isEmpty(values.legalOwnerMail) &&
              !emailValidation(values.legalOwnerMail)
            ) {
              const legalOwnerMailError = {
                ...errors,
                legalOwnerMail: 'Invalid email address!',
              };
              setErrors(legalOwnerMailError);
            } else {
              const legalOwnerMailError = {
                ...errors,
                legalOwnerMail: '',
              };
              setErrors(legalOwnerMailError);
            }
          }}
          label={t('app.forms.Create-company.Legal-email')}
        />
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
          type="submit"
          className="w4 grow h2 pointer mr3"
          style={{
            background: '#08A0F7',
            outline: 'none',
            color: 'white',
          }}
          onClick={(e: any) => {
            e.preventDefault();
            if (!emptyValueCheck() && emptyErrorCheck()) {
              const { name, ...newValues } = values;
              props.editCompanyInfoAction(newValues);
              props.setShowDialog(false);
            }
          }}
        >
          Save
        </Button>
        <Button
          className="w4 grow h2 pointer"
          style={{
            background: '#fff',
            outline: 'none',
            border: '1px solid #08A0F7',
            color: '#08A0F7',
          }}
          onClick={(e: any) => {
            e.preventDefault();
            props.setShowDialog(false);
          }}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

const mapStateToProps = (state: any) => {
  return {
    companyInfo: state.companyReducer.currentCompany,
    previousData: state.companyBasicInfoFormReducer.data,
  };
};

export const CompanyInfoForm = connect(mapStateToProps, {
  saveCompanyBasicInfoForm,
  editCompanyInfoAction,
})(CompanyInfoFormComponent);
